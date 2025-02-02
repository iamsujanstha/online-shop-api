import { CreateItemDto } from '@item/dto/create-item.dto';
import { Wishlist } from '@wishlist/schemas/wishlist.schema';

/**
 * Interface for Wishlist Service
 * Defines the methods that our service must implement
 */
export interface IWishlistService {
  /**
   * Find a wishlist by user id
   * @param userId - The id of the user
   * @returns A promise that resolves to a Wishlist
   */
  getWishlistByUserId(userId: string): Promise<Wishlist>;

  /**
   * Find a wishlist by id
   * @param id - The id of the wishlist
   * @returns A promise that resolves to a Wishlist
   */
  getWishlistById(id: string): Promise<Wishlist>;

  /**
   * Find a wishlist with items by id
   * @param id - The id of the wishlist
   * @returns A promise that resolves to a Wishlist with items
   */
  getWishlistWithItemsById(id: string): Promise<Wishlist>;

  /**
   * Add an item to a wishlist
   * @param userId - The id of the user
   * @param newItem - The item to add
   * @returns A promise that resolves to a Wishlist
   */
  addItemToWishlist(userId: string, newItem: CreateItemDto): Promise<Wishlist>;

  /**
   * Remove an item from a wishlist
   * @param id - The id of the wishlist
   * @param itemId - The id of the item to remove
   * @returns A promise that resolves to a Wishlist
   */
  removeItemFromWishlist(id: string, itemId: string): Promise<Wishlist>;
}
