import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchService } from '@search/services/search.service';
import { AwsStorageService } from '@storages/services/aws-storage.service';
import { Offering, OfferingSchema } from './schemas/offering.schema';
import { OfferingController } from './controllers/offering.controller';
import { OfferingService } from './services/offering.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offering.name, schema: OfferingSchema },
    ]),
  ],
  controllers: [OfferingController],
  providers: [OfferingService, SearchService, AwsStorageService],
  exports: [OfferingService],
})
export class OfferingModule {}
