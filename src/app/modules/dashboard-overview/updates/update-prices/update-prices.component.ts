import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PricesService } from '../../../../services/updates/prices.service';

@Component({
  selector: 'app-update-prices',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './update-prices.component.html',
  styles: ``,
})
export class UpdatePricesComponent {
  calculationRequestPrice = signal(0);
  deliveryToHomePrice = signal(0);
  deliveryToStorePrice = signal(0);
  freeTransportation = signal(0);
  boxPrice = signal(0);

  constructor(private readonly pricesService: PricesService) {
    this.pricesService.listenPrices((data) => {
      this.calculationRequestPrice.set(data.calculationRequestPrice || 0);
      this.deliveryToHomePrice.set(data.deliveryToHome);
      this.deliveryToStorePrice.set(data.deliveryToStore);
      this.freeTransportation.set(data.freeTransportation);
      this.boxPrice.set(data.boxPrice);
    });
  }

  updateRequestPrice() {
    this.pricesService.updatePrice({
      calculationRequestPrice: Number(this.calculationRequestPrice()),
    });
  }
  updateToHomePrice() {
    this.pricesService.updatePrice({
      deliveryToHome: Number(this.deliveryToHomePrice()),
    });
  }
  updateToStorePrice() {
    this.pricesService.updatePrice({
      deliveryToStore: Number(this.deliveryToStorePrice()),
    });
  }
  updateFreeTransportation() {
    this.pricesService.updatePrice({
      freeTransportation: Number(this.freeTransportation()),
    });
  }
  updateBoxPrice() {
    this.pricesService.updatePrice({
      boxPrice: Number(this.boxPrice()),
    });
  }
}
