import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type RentingDocument = Renting & mongoose.Document;

@Schema({ timestamps: true })
export class Renting {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, index: true })
  subcategory: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed, index: true })
  attributes: { key: string; value: string }[];
}

export const RentingSchema = SchemaFactory.createForClass(Renting);

RentingSchema.index({
  name: 'text',
  category: 'text',
  description: 'text',
  subcategory: 'text',
});

RentingSchema.index({ name: 1 });
