import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '@user/schemas/user.schema';
import { Chat } from './chat.schema';

export type MessageDocument = Message & mongoose.Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Chat.name,
    required: true,
  })
  chat: Chat;

  @Prop({ type: String })
  text?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  files?: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  sender: User;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({
  text: 1,
  sender: 1,
});
