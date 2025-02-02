import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  Query,
  UploadedFiles,
  HttpStatus,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateOfferingDto } from '@offering/dto/create-offering.dto';
import { PaginatedResourceDto } from '@search/dto/paginated-resource.dto';
import { UpdateOfferingDto } from '@offering/dto/update-offering.dto';
import { Offering } from '@offering/schemas/offering.schema';
import { OfferingService } from '@offering/services/offering.service';
import {
  Filtering,
  FilteringParams,
} from '@shared/decorators/filtering.decorator';
import {
  Pagination,
  PaginationParams,
} from '@shared/decorators/pagination.decorator';
import { AwsStorageService } from '@storages/services/aws-storage.service';

@ApiTags('Proffesional Services')
@Controller('offerings')
@UseInterceptors(CacheInterceptor)
export class OfferingController {
  public constructor(
    private readonly offeringService: OfferingService,
    private readonly awsStorage: AwsStorageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an offering' })
  @ApiBody({ type: CreateOfferingDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The product has been successfully created.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  public async createOffering(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() offering: CreateOfferingDto,
  ): Promise<Offering> {
    const imageUrls = await this.awsStorage.uploadMultipleFiles(images);
    const offeringWithImages = { ...offering, images: imageUrls };
    return this.offeringService.createOffering(offeringWithImages);
  }

  @Get()
  @ApiOperation({ summary: 'Get offerings' })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description: 'Size of items per page',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'text',
    required: false,
    type: String,
    description: 'Text to search for',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful retrieval of offerings',
    type: PaginatedResourceDto<Offering>,
  })
  public async getAllOfferings(
    @PaginationParams() pagination: Pagination,
    @FilteringParams() filters: Filtering,
    @Query('text') text: string,
  ): Promise<Offering[]> {
    if (text) {
      return this.offeringService.getOfferingBySearchQuery(pagination, text);
    } else {
      return this.offeringService.getOfferingsByFilters(pagination, filters);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an offering by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the offering with the given ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Offering not found.',
  })
  public async getOfferingById(@Param('id') id: string): Promise<Offering> {
    return this.offeringService.getOfferingById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an offering by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The offering has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Offering not found.',
  })
  public async updateOffering(
    @Param('id') id: string,
    @Body() offering: UpdateOfferingDto,
  ): Promise<Offering> {
    return this.offeringService.updateOffering(id, offering);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an offering by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The offering has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Offering not found.',
  })
  public async deleteOffering(@Param('id') id: string): Promise<void> {
    return this.offeringService.removeOffering(id);
  }
}
