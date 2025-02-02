import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateOfferingDto {
  @ApiProperty({
    description: 'The unique identifier of the seller',
    example: '668a5fb74ddcd5703f6fdba7',
  })
  seller: string;

  @ApiProperty({
    description: 'The name of the offering',
    example: 'Sample Offering',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the offering',
    example: 'This is a sample offering',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Array of image files',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: true,
  })
  images?: any;

  @ApiProperty({
    description: 'The category of the offering',
    example: 'Category1',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The subcategory of the offering',
    example: 'Subcategory1',
  })
  @IsNotEmpty()
  @IsString()
  subcategory: string;

  @ApiProperty({
    description: 'Attributes of the product',
    example: [
      { key: 'color', value: 'red' },
      { key: 'size', value: 'M' },
    ],
  })
  attributes: { key: string; value: string }[];
}
