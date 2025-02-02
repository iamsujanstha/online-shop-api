import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeError } from '@stripe/enums/stripe-error.enum';
import { StripeMetadata } from '@stripe/interfaces/metadata.interface';

@Injectable()
export class StripePaymentService {
  private readonly logger = new Logger(StripePaymentService.name);

  private stripe: Stripe;

  public constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
      apiVersion: this.configService.get('STRIPE_API_VERSION'),
    });
  }

  public async createCustomer(name: string, email: string) {
    this.logger.log(`Creating customer with name: ${name}, email: ${email}`);
    try {
      const customer = await this.stripe.customers.create({ name, email });
      this.logger.log(`Customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error(
        `Failed to create customer with email: ${email}`,
        error.stack,
      );
      throw error;
    }
  }

  public async createPaymentIntent(
    amount: number,
    metadata: StripeMetadata,
    customerId: string,
  ): Promise<Stripe.PaymentIntent> {
    this.logger.log(
      `Creating payment intent for customer ${customerId} with amount ${amount}`,
    );
    try {
      const amountInCents = Math.round(amount * 100);
      this.logger.debug(`Payment intent metadata: ${JSON.stringify(metadata)}`);
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        customer: customerId,
        currency: 'usd',
        metadata: metadata,
        confirm: false,
      });
      this.logger.log(`Payment intent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error(
        `Failed to create payment intent for customer ${customerId} with amount ${amount}`,
        error.stack,
      );
      throw error;
    }
  }

  public async createSubscription(priceId: string, customerId: string) {
    this.logger.log(
      `Creating subscription for customer ${customerId} with price ID: ${priceId}`,
    );
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
      });
      this.logger.log(`Subscription created: ${subscription.id}`);
      return subscription;
    } catch (error) {
      this.logger.error(
        `Failed to create subscription for customer ${customerId}`,
        error.stack,
      );
      if (error?.code === StripeError.ResourceMissing) {
        throw new BadRequestException('Credit card not set up');
      }
      throw new InternalServerErrorException();
    }
  }

  public async attachCreditCard(paymentMethodId: string, customerId: string) {
    this.logger.log(
      `Attaching credit card with payment method ID: ${paymentMethodId} to customer ${customerId}`,
    );
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method: paymentMethodId,
      });
      this.logger.log(`Credit card attached: ${setupIntent.id}`);
      return setupIntent;
    } catch (error) {
      this.logger.error(
        `Failed to attach credit card to customer ${customerId}`,
        error.stack,
      );
      throw error;
    }
  }

  public async listCreditCards(customerId: string) {
    this.logger.log(`Listing credit cards for customer ${customerId}`);
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      this.logger.log(
        `Listed ${paymentMethods.data.length} credit cards for customer ${customerId}`,
      );
      return paymentMethods;
    } catch (error) {
      this.logger.error(
        `Failed to list credit cards for customer ${customerId}`,
        error.stack,
      );
      throw error;
    }
  }

  public async listSubscriptions(priceId: string, customerId: string) {
    this.logger.log(
      `Listing subscriptions for customer ${customerId} with price ID: ${priceId}`,
    );
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        price: priceId,
        expand: ['data.latest_invoice', 'data.latest_invoice.payment_intent'],
      });
      this.logger.log(
        `Listed ${subscriptions.data.length} subscriptions for customer ${customerId}`,
      );
      return subscriptions;
    } catch (error) {
      this.logger.error(
        `Failed to list subscriptions for customer ${customerId}`,
        error.stack,
      );
      throw error;
    }
  }

  public async constructEventFromPayload(
    signature: string,
    payload: Buffer,
  ): Promise<Stripe.Event> {
    this.logger.log(
      `Constructing event from payload with signature: ${signature}`,
    );
    try {
      const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
      this.logger.log(`Event constructed: ${event.id}`);
      return event;
    } catch (error) {
      this.logger.error(`Failed to construct event from payload`, error.stack);
      throw error;
    }
  }
}
