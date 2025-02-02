import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { ProductService } from '@product/services/product.service';
import { ItemTypes } from '@item/enums/item-types.enum';
import { Item } from '@item/schemas/item.schema';

@Injectable()
export class InventoryService {
  public constructor(private readonly productService: ProductService) {}

  public async updateInventory(
    items: Item[],
    session?: ClientSession,
  ): Promise<void> {
    const productsToUpdate = items.filter(
      (item) => item.type === ItemTypes.PRODUCT,
    );
    await Promise.all(
      productsToUpdate.map((product) =>
        this.productService.updateProductStock(
          product.id,
          product.quantity,
          session,
        ),
      ),
    );
  }
}
