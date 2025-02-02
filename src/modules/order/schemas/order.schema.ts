import { NotFoundException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '@user/schemas/user.schema';
import { OrderStatus } from '@order/enums/order-status.enum';
import { Item, ItemSchema } from '@item/schemas/item.schema';
import { PaymentMethod } from '@order/enums/payment-method';
import { ItemTypes } from '@item/enums/item-types.enum';

export type OrderDocument = Order & mongoose.Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  customer: User;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];

  @Prop({ enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Prop({ required: true, default: 0.0 })
  amount: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: Number })
  track_number: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  billing_details: any;

  @Prop({ type: String })
  order_notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

async function validateUser(user: User, userModel: any) {
  const userExists = await userModel.exists({ _id: user });
  if (!userExists) {
    throw new NotFoundException(`User with ID ${user} not found`);
  }
}

async function validateItems(items: Item[], models: Record<ItemTypes, any>) {
  for (const item of items) {
    const model = models[item.type];
    if (!model)
      throw new NotFoundException(`Item type ${item.type} is invalid`);

    const itemExists = await model.exists({ _id: item.id });
    if (!itemExists) {
      throw new NotFoundException(
        `Item with ID ${item.id} of type ${item.type} not found`,
      );
    }
  }
}

OrderSchema.pre<OrderDocument>('save', async function (next) {
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
