import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { User } from '@user/schemas/user.schema';
import { ItemTypes } from '@item/enums/item-types.enum';
import { Item, ItemSchema } from '@item/schemas/item.schema';
import {
  ShippingCosts,
  ShippingOptions,
} from '@shipping/enums/shipping-options.enum';

export type CartDocument = Cart & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  customer: User;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];

  @Prop({ type: [String], enum: ShippingOptions, required: true })
  shipping: ShippingOptions[];

  @Prop({ type: Number, default: 0 })
  subtotal: number;

  @Prop({ type: Number, default: 0 })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

async function validateCart(
  cart: CartDocument,
  userModel: any,
  models: Record<ItemTypes, any>,
) {
  const userExists = await userModel.exists({ _id: cart.customer });
  if (!userExists) {
    throw new NotFoundException(`User with ID ${cart.customer} not found`);
  }

  const itemValidationPromises = cart.items.map(async (item) => {
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
  });

  await Promise.all(itemValidationPromises);
}

async function getItemPrices(
  items: Item[],
  models: Record<ItemTypes, any>,
): Promise<number[]> {
  const pricePromises = items.map(async (item) => {
    const model = models[item.type];
    const itemData = await model.findById(item.id).select('price').exec();
    if (!itemData) {
      throw new NotFoundException(
        `Item with ID ${item.id} of type ${item.type} not found`,
      );
    }
    return itemData.price * item.quantity;
  });

  return Promise.all(pricePromises);
}

CartSchema.pre<CartDocument>('save', async function (next) {
  const userModel = this.model('User');
  const models = {
    [ItemTypes.PRODUCT]: this.model('Product'),
    [ItemTypes.OFFERING]: this.model('Offering'),
    [ItemTypes.RENTING]: this.model('Renting'),
  };

  try {
    await validateCart(this, userModel, models);

    const itemPrices = await getItemPrices(this.items, models);
    this.subtotal = itemPrices.reduce((acc, price) => acc + price, 0);

    const shippingCost = this.shipping.reduce(
      (acc, option) => acc + ShippingCosts[option],
      0,
    );
    this.total = this.subtotal + shippingCost;

    next();
  } catch (error) {
    next(error);
  }
});
