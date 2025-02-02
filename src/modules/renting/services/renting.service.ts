import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRentingDto } from '@renting/dto/create-renting.dto';
import { UpdateRentingDto } from '@renting/dto/update-renting.dto';
import { Renting, RentingDocument } from '@renting/schemas/renting.schema';
import { SearchService } from '@search/services/search.service';
import { clearCacheKeys } from '@shared/cache/clear.cache';
import { Pagination } from '@shared/decorators/pagination.decorator';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';

@Injectable()
export class RentingService {
  private readonly searchService: SearchService<RentingDocument>;

  public constructor(
    @InjectModel(Renting.name)
    private readonly rentingModel: Model<RentingDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.searchService = new SearchService<RentingDocument>(rentingModel);
  }

  public async create(createRentingDto: CreateRentingDto): Promise<Renting> {
    const createdRent = new this.rentingModel(createRentingDto);
    return createdRent.save();
  }

  public async getAllRentings(): Promise<Renting[]> {
    return this.rentingModel.find().lean();
  }

  public async getRentingById(id: string): Promise<Renting> {
    const offering = await this.rentingModel.findById(id).lean();

    if (!offering)
      throw new NotFoundException(`Renting with ID ${id} not found`);

    return offering;
  }

  public async getRentingByFilters(
    pagination: Pagination,
    filters: {
      [key: string]: any;
    } = {},
  ): Promise<Renting[]> {
    return this.searchService.searchWithPaginationAndFilters(
      pagination,
      filters,
    );
  }

  public async getRentingBySearchQuery(
    pagination: Pagination,
    searchQuery: string,
  ): Promise<Renting[]> {
    return this.searchService.searchWithPaginationAndText(
      pagination,
      searchQuery,
    );
  }

  public async updateRenting(
    id: string,
    updateRentingDto: UpdateRentingDto,
  ): Promise<Renting> {
    const existingRenting = await this.rentingModel.findByIdAndUpdate(
      id,
      updateRentingDto,
      { new: true },
    );

    if (!existingRenting)
      throw new NotFoundException(`Renting with ID ${id} not found`);

    return existingRenting;
  }

  public async remove(id: string) {
    const result = await this.rentingModel.findByIdAndDelete(id);

    if (!result) throw new NotFoundException(`Renting with ID ${id} not found`);

    await clearCacheKeys(this.cacheManager);
  }
}
