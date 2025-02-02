import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';
import { StripePaymentService } from '@stripe/services/stripe-payment.service';
import { AwsStorageService } from '@storages/services/aws-storage.service';
import { UserController } from './controllers/user.controller';
import { ProfileController } from './controllers/profile.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, StripePaymentService, AwsStorageService],
  controllers: [UserController, ProfileController],
  exports: [UserService],
})
export class UserModule {}
