import { Component, Input } from '@angular/core';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-total-price',
  standalone: true,
  imports: [TwCurrencyPipe],
  template: `
    <div class="grid grid-cols-[1fr,auto] gap-x-4 text-right">
      <div
        class="text-gray-500 text-mobileSmall lg:text-desktopSmall text-right"
      >
        商品:
      </div>
      <div class="text-gray-500 text-mobileSmall lg:text-desktopSmall">
        {{ itemPrice | twCurrency }}
      </div>
      <div
        class="text-gray-500 text-mobileSmall lg:text-desktopSmall text-right"
      >
        運費:
      </div>
      <div class="text-gray-500 text-mobileSmall lg:text-desktopSmall">
        {{ deliveryFee | twCurrency }}
      </div>
    </div>

    <div class="text-mobileSubTitle lg:text-desktopSubTitle">
      總計：{{ itemPrice + deliveryFee | twCurrency }}
    </div>
  `,
  styles: ``,
})
export class TotalPriceComponent {
  @Input() itemPrice = 0;
  @Input() deliveryFee = 0;
}
