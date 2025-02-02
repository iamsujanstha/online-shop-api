import { CreateChatDto } from '@chat/dto/create-chat.dto';
import { Chat } from '@chat/schemas/chat.schema';
import { ChatService } from '@chat/services/chat.service';
import { Body, Post, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  public constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a chat' })
  @ApiResponse({ status: 201, type: Chat })
  public async createChat(@Body() chat: CreateChatDto) {
    return this.chatService.findOrCreateChat(chat);
  }
}
