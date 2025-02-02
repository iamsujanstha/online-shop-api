import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchService } from '@search/services/search.service';
import { Pagination } from '@shared/decorators/pagination.decorator';
import { Offering, OfferingDocument } from '@offering/schemas/offering.schema';
import { CreateOfferingDto } from '@offering/dto/create-offering.dto';
import { UpdateOfferingDto } from '@offering/dto/update-offering.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { clearCacheKeys } from '@shared/cache/clear.cache';

@Injectable()
export class OfferingService {
  private readonly logger = new Logger(OfferingService.name);

  private readonly searchService: SearchService<OfferingDocument>;

  public constructor(
    @InjectModel(Offering.name) private offeringModel: Model<OfferingDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.searchService = new SearchService<OfferingDocument>(offeringModel);
  }

  public async createOffering(
    createOfferingDto: CreateOfferingDto,
  ): Promise<Offering> {
    this.logger.log('Creating a new offering');
    const newOffering = new this.offeringModel(createOfferingDto);
    const savedOffering = await newOffering.save();
    this.logger.log(`Offering created with ID: ${savedOffering._id}`);

    await clearCacheKeys(this.cacheManager);

    return savedOffering;
  }

  public async getAllOfferings(): Promise<Offering[]> {
    this.logger.log('Fetching all offerings');
    return this.offeringModel.find();
  }

  public async getOfferingById(id: string): Promise<Offering> {
    this.logger.log(`Fetching offering with ID: ${id}`);
    const offering = await this.offeringModel.findById(id);
    if (!offering) {
      this.logger.warn(`Offering with ID ${id} not found`);
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
    return offering;
  }

  public async getOfferingsByFilters(
    pagination: Pagination,
    filters: {
      [key: string]: any;
    } = {},
  ): Promise<Offering[]> {
    this.logger.log('Fetching offerings with filters');
    return this.searchService.searchWithPaginationAndFilters(
      pagination,
      filters,
    );
  }

  public async getOfferingBySearchQuery(
    pagination: Pagination,
    searchQuery: string,
  ): Promise<Offering[]> {
    this.logger.log(`Fetching offerings with search query: ${searchQuery}`);
    return this.searchService.searchWithPaginationAndText(
      pagination,
      searchQuery,
    );
  }

  public async updateOffering(
    id: string,
    updateOfferingDto: UpdateOfferingDto,
  ): Promise<Offering> {
    this.logger.log(`Updating offering with ID: ${id}`);
    const updatedOffering = await this.offeringModel.findByIdAndUpdate(
      id,
      updateOfferingDto,
      { new: true },
    );
    if (!updatedOffering) {
      this.logger.warn(`Offering with ID ${id} not found`);
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }
    this.logger.log(`Offering with ID ${id} updated`);
    return updatedOffering;
  }

  public async removeOffering(id: string): Promise<void> {
    this.logger.log(`Removing offering with ID: ${id}`);
    const deletedOffering = await this.offeringModel.findByIdAndDelete(id);
    if (!deletedOffering) {
      this.logger.warn(`Offering with ID ${id} not found`);
      throw new NotFoundException(`Offering with ID ${id} not found`);
    }

    await clearCacheKeys(this.cacheManager);

    this.logger.log(`Offering with ID ${id} removed`);
  }
}
