import { Module } from '@nestjs/common';
import { SearchService } from './services/search.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
