import { Injectable } from '@nestjs/common';
import { OfferingService } from '@offering/services/offering.service';
import { ProductService } from '@product/services/product.service';
import { RentingService } from '@renting/services/renting.service';
import { ItemTypes } from '@item/enums/item-types.enum';

@Injectable()
export class ItemService {
  private readonly serviceByType = {
    [ItemTypes.PRODUCT]: this.productService,
    [ItemTypes.OFFERING]: this.offeringService,
    [ItemTypes.RENTING]: this.rentingService,
  };

  public constructor(
    private productService: ProductService,
    private offeringService: OfferingService,
    private rentingService: RentingService,
  ) {}

  private _getServiceByType(type: ItemTypes) {
    const service = this.serviceByType[type];
    if (!service) {
      throw new Error(`Unsupported item type: ${type}`);
    }
    return service;
  }

  // public async updateStock(itemId: string, quantity: number) {
  //   const updatedItem = await this.productService.updateStock(itemId, quantity);
  //   if (!updatedItem) {
  //     throw new BadRequestException(`Insufficient stock for item ${itemId}`);
  //   }
  //   return updatedItem;
  // }

  // public async populateItems(items: Item[]): Promise<any[]> {
  //   const promises = items.map(({ type, id: id }) => {
  //     const service = this._getServiceByType(type);
  //     return service.findById(id);
  //   });
  //
  //   return Promise.all(promises);
  // }
}
