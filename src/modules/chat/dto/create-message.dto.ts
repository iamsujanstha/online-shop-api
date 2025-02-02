import { IsOptional } from 'class-validator';

export class CreateMessageDto {
  chat: string;

  @IsOptional()
  text?: string;

  @IsOptional()
  files?: any;

  sender: string;
}
