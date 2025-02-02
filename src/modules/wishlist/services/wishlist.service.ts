import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItemDto } from '@item/dto/create-item.dto';
import { Item } from '@item/schemas/item.schema';
import { Wishlist, WishlistDocument } from '@wishlist/schemas/wishlist.schema';
import { IWishlistService } from '@wishlist/interfaces/wishlist.service.interface';

@Injectable()
export class WishlistService implements IWishlistService {
  private readonly logger = new Logger(WishlistService.name);

  public constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
  ) {}

  public async getWishlistByUserId(userId: string): Promise<Wishlist> {
    this.logger.log(`Fetching wishlist for user with ID: ${userId}`);
    const wishlist = await this.wishlistModel.findOne({ customer: userId });

    if (!wishlist) {
      this.logger.warn(`No wishlists found for user with ID: ${userId}`);
      throw new NotFoundException(
        `No wishlists found for user with id ${userId}`,
      );
    }

    this.logger.log(`Fetched wishlist for user with ID: ${userId}`);
    return wishlist;
  }

  public async getWishlistById(id: string): Promise<Wishlist> {
    this.logger.log(`Fetching wishlist with ID: ${id}`);
    const wishlist = await this.wishlistModel.findById(id);

    if (!wishlist) {
      this.logger.warn(`Wishlist with ID ${id} not found`);
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    this.logger.log(`Fetched wishlist with ID: ${id}`);
    return wishlist;
  }

  public async getWishlistWithItemsById(id: string): Promise<Wishlist> {
    this.logger.log(`Fetching wishlist with items for ID: ${id}`);
    const wishlist = await this.wishlistModel
      .findById(id)
      .populate('items.id', 'name price')
      .exec();

    if (!wishlist) {
      this.logger.warn(`Wishlist with ID ${id} not found`);
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    this.logger.log(`Fetched wishlist with items for ID: ${id}`);
    return wishlist;
  }

  public async addItemToWishlist(
    userId: string,
    newItem: CreateItemDto,
  ): Promise<Wishlist> {
    this.logger.log(`Adding item ${newItem.id} to wishlist for user ${userId}`);
    const existingWishlist = await this.wishlistModel.findOne({
      customer: userId,
    });

    if (!existingWishlist) {
      const wishlist = new this.wishlistModel({
        customer: userId,
        items: [newItem],
      });
      this.logger.log(`Created new wishlist for user ${userId}`);
      return wishlist.save();
    } else {
      const itemExists = existingWishlist.items.some(
        (i) => i.id === newItem.id && i.type === newItem.type,
      );

      if (!itemExists) {
        existingWishlist.items.push(newItem);
        this.logger.log(
          `Added new item ${newItem.id} to wishlist ${existingWishlist.id}`,
        );
      } else {
        this.logger.log(
          `Item ${newItem.id} already exists in wishlist ${existingWishlist.id}`,
        );
      }
      return existingWishlist.save();
    }
  }

  public async removeItemFromWishlist(
    id: string,
    itemId: string,
  ): Promise<Wishlist> {
    this.logger.log(`Removing item ${itemId} from wishlist ${id}`);
    const existingWishlist = await this.getByIdOrThrow(id);

    const itemIndex = existingWishlist.items.findIndex(
      (item: Item) => item.id === itemId,
    );

    if (itemIndex === -1) {
      this.logger.warn(`Item with ID ${itemId} not found in wishlist ${id}`);
      throw new NotFoundException(
        `Item with ID ${itemId} not found in wishlist`,
      );
    }

    existingWishlist.items.splice(itemIndex, 1);
    this.logger.log(`Removed item ${itemId} from wishlist ${id}`);
    return existingWishlist.save();
  }

  public async removeWishlist(id: string): Promise<Wishlist> {
    this.logger.log(`Removing wishlist with ID: ${id}`);
    const result = await this.wishlistModel.findByIdAndDelete(id);

    if (!result) {
      this.logger.warn(`Wishlist with ID ${id} not found`);
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    this.logger.log(`Removed wishlist with ID: ${id}`);
    return result;
  }

  private async getByIdOrThrow(id: string): Promise<WishlistDocument> {
    this.logger.log(`Fetching wishlist with ID: ${id}`);
    const wishlist = await this.wishlistModel.findById(id);

    if (!wishlist) {
      this.logger.warn(`Wishlist with ID ${id} not found`);
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    this.logger.log(`Fetched wishlist with ID: ${id}`);
    return wishlist;
  }
}
