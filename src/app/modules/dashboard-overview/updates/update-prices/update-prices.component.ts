import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PricesService } from '../../../../services/updates/prices.service';

@Component({
  selector: 'app-update-prices',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-prices.component.html',
  styles: ``,
})
export class UpdatePricesComponent {
  calculationRequestPrice = 0;
  deliveryToHomePrice = 0;
  deliveryToStorePrice = 0;
  freeTransportation = 0;

  constructor(private readonly pricesService: PricesService) {
    this.pricesService.listenPrices((data) => {
      this.calculationRequestPrice = data.calculationRequestPrice || 0;
      this.deliveryToHomePrice = data.deliveryToHome;
      this.deliveryToStorePrice = data.deliveryToStore;
      this.freeTransportation = data.freeTransportation;
    });
  }

  updateRequestPrice() {
    this.pricesService.updateRequestPrice(Number(this.calculationRequestPrice));
  }
  updateToHomePrice() {
    this.pricesService.updateDeliveryToHome(Number(this.deliveryToHomePrice));
  }
  updateToStorePrice() {
    this.pricesService.updateDeliveryToStore(Number(this.deliveryToStorePrice));
  }
  updateFreeTransportation() {
    this.pricesService.updateFreeTransportation(
      Number(this.freeTransportation),
    );
  }
}
