import { Component, computed, input } from '@angular/core';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-total-price',
  standalone: true,
  imports: [TwCurrencyPipe],
  template: `
    <div class="grid grid-cols-[1fr,auto] gap-x-4 text-right">
      <div
        class="text-gray-500 text-mobileSmall sm:text-desktopSmall text-right"
      >
        商品:
      </div>
      <div class="text-gray-500 text-mobileSmall sm:text-desktopSmall">
        {{ itemPrice() | twCurrency }}
      </div>
      <div
        class="text-gray-500 text-mobileSmall sm:text-desktopSmall text-right"
      >
        運費:
      </div>
      <div class="text-gray-500 text-mobileSmall sm:text-desktopSmall">
        {{ deliveryFee() | twCurrency }}
      </div>
    </div>

    <div class="text-mobileSubTitle sm:text-desktopSubTitle font-bold">
      總計：{{ totalPrice() | twCurrency }}
    </div>
  `,
  styles: ``,
})
export class TotalPriceComponent {
  itemPrice = input(0);
  deliveryFee = input(0);

  totalPrice = computed(() => this.itemPrice() + this.deliveryFee());
}
