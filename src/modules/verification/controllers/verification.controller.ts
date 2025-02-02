import { Controller } from '@nestjs/common';
import { VerificationService } from '../services/verification.service';

@Controller('verification')
export class VerificationController {
  public constructor(
    private readonly verificationService: VerificationService,
  ) {}
}
