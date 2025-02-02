import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentingService } from './services/renting.service';
import { RentingController } from './controllers/renting.controller';
import { Renting, RentingSchema } from './schemas/renting.schema';
import { AwsStorageService } from '@storages/services/aws-storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Renting.name, schema: RentingSchema }]),
  ],
  controllers: [RentingController],
  providers: [RentingService, AwsStorageService],
  exports: [RentingService],
})
export class RentingModule {}
