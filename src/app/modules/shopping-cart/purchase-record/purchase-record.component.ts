import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { RecipientInformationComponent } from 'src/app/components/recipient-information/recipient-information.component';
import { RemittanceStateComponent } from 'src/app/components/remittance-state/remittance-state.component';
import { RemittanceStateType } from 'src/app/models/account';
import { CartFeedbackStateMap, CartRecord } from 'src/app/models/cart';
import { DesktopCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/desktop-cart-item.component';
import { ExpandedCartLayoutComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/expanded-cart-layout.component';
import { MobileCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/mobile-cart-item.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { UserBank } from 'src/app/services/bank/bank.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-purchase-record',
  standalone: true,
  imports: [
    AsyncPipe,
    DesktopCartItemComponent,
    MobileCartItemComponent,
    ExpandedCartLayoutComponent,
    DividerComponent,
    MatIconModule,
    TwCurrencyPipe,
    RecipientInformationComponent,
    RemittanceStateComponent,
  ],
  templateUrl: './purchase-record.component.html',
  styles: ``,
})
export class PurchaseRecordComponent {
  cartRecords: CartRecord[] = [];
  showDetail = signal<Record<string | number, boolean>>({});
  CartRemittanceState = RemittanceStateType;
  CartFeedbackStateMap = CartFeedbackStateMap;

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly notifyService: NotifyService,
    public readonly responsive: ResponsiveService,
  ) {
    this.shoppingCartService
      .getCartRecords()
      .pipe(takeUntilDestroyed())
      .subscribe((cartRecords) => {
        this.cartRecords = cartRecords;
      });

    this.notifyService.readNotify('cart', 'customer');
  }

  onUpdateShowDetail(id: string | number, show: boolean) {
    this.showDetail.update((prev) => ({ ...prev, [id]: show }));
  }

  onUpdateCartRecordRemittanceState(
    recordId: string,
    bank: UserBank,
    paid: number,
  ) {
    this.shoppingCartService.payCartRecord(recordId, bank, paid);
    this.notifyService.updateNotify('cart', 'customer');
  }
}
