import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Review } from '@review/schemas/review.schema';
import { ReviewService } from '@review/services/review.service';
import { CreateReviewDto } from '@review/dto/create-review.dto';
import { UpdateReviewDto } from '@review/dto/update-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  public constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reviews found',
    type: [Review],
  })
  public async getAllReviews(): Promise<Review[]> {
    return this.reviewService.getAllReviews();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Review found',
    type: Review,
  })
  public async getReviewById(@Param('id') id: string): Promise<Review> {
    return this.reviewService.getReviewById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Review created',
    type: Review,
  })
  public async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewService.createReview(createReviewDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a review by id' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Review updated',
    type: Review,
  })
  public async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewService.updateReview(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review by id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Review deleted' })
  public async removeReview(@Param('id') id: string): Promise<void> {
    return this.reviewService.removeReview(id);
  }
}
