import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User, UserDocument } from '@user/schemas/user.schema';

export type ChatDocument = Chat & mongoose.Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  participants: UserDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
