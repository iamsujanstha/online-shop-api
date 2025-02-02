import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { User, UserDocument } from '@user/schemas/user.schema';
import { CreateChatDto } from '@chat/dto/create-chat.dto';
import { Events } from '@chat/enums/events.enum';
import { Chat, ChatDocument } from '@chat/schemas/chat.schema';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  public constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async findOrCreateChat(
    createChatDto: CreateChatDto,
  ): Promise<{ chat: ChatDocument; isNew: boolean }> {
    const { participants } = createChatDto;

    const existingChat = await this.chatModel
      .findOne({
        participants: { $all: participants, $size: participants.length },
      })
      .exec();

    if (existingChat) {
      return { chat: existingChat, isNew: false };
    }

    const newChat = await this.chatModel.create({ participants });
    return { chat: newChat, isNew: true };
  }

  public async updateUserOnlineStatus(
    userId: string,
    status: boolean,
  ): Promise<void> {
    this.logger.log(`User ${userId} is ${status ? 'online' : 'offline'}`);
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { is_online: status },
    );
  }

  public async getUserChats(userId: string): Promise<ChatDocument[]> {
    return this.chatModel.find({ participants: userId }).populate({
      path: 'participants',
      select: { name: 1, surname: 1, type: 1, is_online: 1 },
    });
  }

  public watchChatCollectionChanges(client: Socket): void {
    const changeStream = this.chatModel.watch();
    changeStream.on('change', async (change: any) => {
      try {
        let chat: any;
        if (change.operationType === 'insert') {
          chat = await this.chatModel
            .findById(change.documentKey._id)
            .populate({
              path: 'participants',
              select: { name: 1, surname: 1, type: 1, is_online: 1 },
            });
        }
        client.emit(Events.RECEIVE_CHAT, chat);
      } catch (error) {
        this.logger.error('Error processing change stream', error.stack);
      }
    });

    changeStream.on('error', (error) => {
      this.logger.error('Change stream error', error.stack);
    });

    client.on('disconnect', () => {
      changeStream.close();
    });
  }
}
