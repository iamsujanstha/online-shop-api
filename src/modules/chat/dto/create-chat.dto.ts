import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    type: [String],
    required: true,
    example: ['66b7b3e8c32055a049b55029', '66ba4b1a9c829e01ecc1a247'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  participants: string[];
}
