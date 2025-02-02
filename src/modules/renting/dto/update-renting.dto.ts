import { PartialType } from '@nestjs/mapped-types';
import { CreateRentingDto } from './create-renting.dto';

export class UpdateRentingDto extends PartialType(CreateRentingDto) {}
