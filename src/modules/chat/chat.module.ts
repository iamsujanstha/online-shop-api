import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@user/schemas/user.schema';
import { TokenModule } from '@token/token.module';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './gateways/chat.gateway';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatController } from './controllers/chat.controller';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    TokenModule,
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, MessageService],
})
export class ChatModule {}
