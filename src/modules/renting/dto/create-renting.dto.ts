import { ApiProperty } from '@nestjs/swagger';

export class CreateRentingDto {
  @ApiProperty({
    description: 'The price of the renting',
    example: 100,
  })
  price: number;

  @ApiProperty({
    description: 'The name of the renting',
    example: 'Sample Renting',
  })
  name: string;

  @ApiProperty({
    description: 'A brief description of the rent',
    example: 'This is a sample rent',
  })
  description?: string;

  @ApiProperty({
    description: 'Array of image files',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: true,
  })
  images?: any;

  @ApiProperty({
    description: 'The category of the rent',
    example: 'sample category',
  })
  category: string;

  @ApiProperty({
    description: 'The subcategory of the rent',
    example: 'sample subcategory',
  })
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
