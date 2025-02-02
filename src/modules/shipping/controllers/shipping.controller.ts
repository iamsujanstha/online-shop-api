import { Controller } from '@nestjs/common';
import { ShippingService } from '@shipping/services/shipping.service';

@Controller('shipping')
export class ShippingController {
  public constructor(private readonly shippingService: ShippingService) {}
}
