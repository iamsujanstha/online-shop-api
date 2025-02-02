import { NotFoundException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '@user/schemas/user.schema';
import { ItemTypes } from '@item/enums/item-types.enum';
import { Item, ItemSchema } from '@item/schemas/item.schema';

export type WishlistDocument = Wishlist & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Wishlist {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  customer: User;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

async function validateUser(user: User, userModel: any) {
  const userExists = await userModel.exists({ _id: user });
  if (!userExists) {
    throw new NotFoundException(`User with ID ${user} not found`);
  }
}

async function validateItems(items: Item[], models: Record<ItemTypes, any>) {
  for (const item of items) {
    const model = models[item.type];
    if (!model) {
      throw new NotFoundException(`Item type ${item.type} is invalid`);
    }

    const itemExists = await model.exists({ _id: item.id });
    if (!itemExists) {
      throw new NotFoundException(
        `Item with ID ${item.id} of type ${item.type} not found`,
      );
    }
  }
}

WishlistSchema.pre<WishlistDocument>('save', async function (next: any) {
  const userModel = this.model('User');
  const models = {
    [ItemTypes.PRODUCT]: this.model('Product'),
    [ItemTypes.OFFERING]: this.model('Offering'),
    [ItemTypes.RENTING]: this.model('Renting'),
  };

  try {
    await validateUser(this.customer, userModel);
    await validateItems(this.items, models);
    next();
  } catch (error) {
    next(error);
  }
});
