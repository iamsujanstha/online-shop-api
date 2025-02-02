import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'User ID who created the review' })
  @IsNotEmpty()
  user: string;

  @ApiProperty({ description: 'Product ID that the review is for' })
  @IsNotEmpty()
  product: string;

  @ApiProperty({
    description: 'Rating given by the user',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Text content of the review' })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
