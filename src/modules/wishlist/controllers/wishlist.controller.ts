import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateItemDto } from '@item/dto/create-item.dto';
import { Wishlist } from '@wishlist/schemas/wishlist.schema';
import { WishlistService } from '@wishlist/services/wishlist.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Wishlists')
@Controller('wishlist')
@UseInterceptors(CacheInterceptor)
export class WishlistController {
  public constructor(private readonly wishlistService: WishlistService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a wishlist by id' })
  @ApiOkResponse({
    description: 'The wishlist has been successfully found.',
    type: Wishlist,
  })
  @ApiNotFoundResponse({ description: 'Wishlist not found.' })
  public async getWishlistById(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistService.getWishlistById(id);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Add an item to a wishlist' })
  @ApiOkResponse({
    description: 'The item has been successfully added.',
    type: Wishlist,
  })
  @ApiBadRequestResponse({ description: 'Invalid item data.' })
  public async addItemToWishlist(
    @Param('userId') userId: string,
    @Body() item: CreateItemDto,
  ): Promise<Wishlist> {
    return this.wishlistService.addItemToWishlist(userId, item);
  }

  @Delete(':id/item/:itemId')
  @ApiOperation({ summary: 'Remove an item from a wishlist' })
  @ApiOkResponse({
    description: 'The item has been successfully removed.',
    type: Wishlist,
  })
  @ApiNotFoundResponse({ description: 'Item not found in wishlist.' })
  public async removeItemFromWishlist(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ): Promise<Wishlist> {
    return this.wishlistService.removeItemFromWishlist(id, itemId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a wishlist' })
  @ApiOkResponse({
    description: 'The wishlist has been successfully removed.',
    type: Wishlist,
  })
  @ApiNotFoundResponse({ description: 'Wishlist not found.' })
  public async removeWishlistById(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistService.removeWishlist(id);
  }
}
