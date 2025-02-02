import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsStorageService {
  private readonly logger = new Logger(AwsStorageService.name);

  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly bucketRegion: string;
  private readonly accessKey: string;
  private readonly secretKey: string;

  public constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
    this.bucketRegion = this.configService.get<string>('AWS_BUCKET_REGION');
    this.accessKey = this.configService.get<string>('AWS_ACCESS_KEY');
    this.secretKey = this.configService.get<string>('AWS_SECRET_KEY');

    this.s3 = new S3Client({
      region: this.bucketRegion,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  public async uploadMultipleFiles(
    files: Array<Express.Multer.File>,
  ): Promise<string[]> {
    this.logger.log(
      `Uploading multiple files: ${files.map((file) => file.originalname).join(', ')}`,
    );
    const uploadPromises = files.map((file) => this.uploadFile(file));
    const urls = await Promise.all(uploadPromises);
    return urls.map((url) => url.url);
  }

  public async uploadSingleFile(file: Express.Multer.File): Promise<string> {
    this.logger.log(`Uploading single file: ${file.originalname}`);
    const { url } = await this.uploadFile(file);
    this.logger.log(`Uploaded file URL: ${url}`);
    return url;
  }

  public async getUrlAndOriginalNames(
    files: Array<Express.Multer.File>,
  ): Promise<{ url: string; originalName: string }[]> {
    this.logger.log(
      `Getting URLs and original names for files: ${files.map((file) => file.originalname).join(', ')}`,
    );
    const uploadPromises = files.map((file) => this.uploadFile(file));
    const results = await Promise.all(uploadPromises);
    this.logger.log(
      `Uploaded files with URLs and original names: ${results.map((result) => `${result.originalName}: ${result.url}`).join(', ')}`,
    );
    return results;
  }

  private async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; originalName: string }> {
    const params = {
      Bucket: this.bucketName,
      Region: this.bucketRegion,
      Key: this.randomFileName(file.originalname),
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    this.logger.log(`Uploading file...`);
    const command = new PutObjectCommand(params);
    await this.s3.send(command);
    const url = `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${params.Key}`;
    this.logger.log(`File uploaded to URL: ${url}`);
    return {
      url,
      originalName: file.originalname,
    };
  }

  private randomFileName(originalName: string): string {
    const randomName = `${Date.now()}-${originalName}`;
    this.logger.log(`Generated random file name: ${randomName}`);
    return randomName;
  }
}
