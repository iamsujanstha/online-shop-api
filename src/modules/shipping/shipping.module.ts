import { Module } from '@nestjs/common';
import { ShippingController } from './controllers/shipping.controller';
import { ShippingService } from './services/shipping.service';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService],
})
export class ShippingModule {}
