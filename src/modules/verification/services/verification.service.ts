import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  private twilioClient: Twilio;
  private serviceSid: string;

  public constructor(private readonly configService: ConfigService) {
    this.twilioClient = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
    this.serviceSid = this.configService.get<string>(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );
  }

  public initiatePhoneNumberVerification(phoneNumber: string) {
    this.logger.log(`Initiating verification for phone number: ${phoneNumber}`);

    return this.twilioClient.verify
      .services(this.serviceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
  }
}
