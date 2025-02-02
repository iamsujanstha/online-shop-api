import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoConfig from '@config/mongo.config';
// import redisStore from 'cache-manager-redis-store';
import { HealthModule } from '@health/health.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { TokenModule } from '@token/token.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModule } from '@review/review.module';
import { EmailModule } from '@email/email.module';
import { ProductModule } from '@product/product.module';
import { OfferingModule } from '@offering/offering.module';
import { CartModule } from '@cart/cart.module';
import { ChatModule } from '@chat/chat.module';
import { StripeModule } from '@stripe/stripe.module';
import { ItemModule } from '@item/item.module';
import { CacheModule } from '@nestjs/cache-manager';
import { WishlistModule } from '@wishlist/wishlist.module';
import { AddressModule } from '@address/address.module';
import { OrderModule } from '@order/order.module';
import { ThrottlerModule } from '@nestjs/throttler';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongoConfig,
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      // useFactory: async (configService: ConfigService) => ({
      //   store: redisStore,
      //   host: configService.get('REDIS_HOST'),
      //   port: configService.get('REDIS_PORT'),
      // }),
      useFactory: async () => {
        return {
          stores: [new KeyvRedis('redis://redis:6379')],
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    HealthModule,
    UserModule,
    AddressModule,
    AuthModule,
    TokenModule,
    OfferingModule,
    ProductModule,
    CartModule,
    ReviewModule,
    EmailModule,
    ChatModule,
    // StripeModule,
    ItemModule,
    WishlistModule,
    OrderModule,
  ],
})
export class MainModule {}
