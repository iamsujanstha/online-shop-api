import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from '@token/token.module';
import { UserModule } from '@user/user.module';
import { OrderModule } from '@order/order.module';
import { StripePaymentController } from './controllers/stripe-payment.controller';
import { StripeSubscriptionController } from './controllers/stripe-subscription.controller';
import { StripeWebhookController } from './controllers/stripe-webhook.controller';
import { StripePaymentService } from './services/stripe-payment.service';
import { StripeSubscriptionService } from './services/stripe-subscription.service';
import { StripeWebhookService } from './services/stripe-webhook.service';
import { StripeEvent, StripeEventSchema } from './schemas/stripe-event.schema';

@Module({
  imports: [
    TokenModule,
    MongooseModule.forFeature([
      { name: StripeEvent.name, schema: StripeEventSchema },
    ]),
    UserModule,
    OrderModule,
  ],
  controllers: [
    StripePaymentController,
    StripeSubscriptionController,
    StripeWebhookController,
  ],
  providers: [
    StripePaymentService,
    StripeSubscriptionService,
    StripeWebhookService,
  ],
})
export class StripeModule {}
