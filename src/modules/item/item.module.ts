import { Module } from '@nestjs/common';
import { OfferingModule } from '@offering/offering.module';
import { ProductModule } from '@product/product.module';
import { RentingModule } from '@renting/renting.module';
import { ItemService } from './services/item.service';

@Module({
  imports: [ProductModule, RentingModule, OfferingModule],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
