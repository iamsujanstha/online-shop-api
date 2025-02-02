import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsStorageService } from '@storages/services/aws-storage.service';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, AwsStorageService],
  exports: [ProductService],
})
export class ProductModule {}
