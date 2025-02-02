import { Module } from '@nestjs/common';
import { AwsStorageService } from './services/aws-storage.service';

@Module({
  providers: [AwsStorageService],
  exports: [AwsStorageService],
})
export class StoragesModule {}
