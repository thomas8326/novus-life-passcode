import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import {
  CartFeedbackStateMap,
  CartRecord,
  CartRemittanceState,
} from 'src/app/models/cart';
import { DesktopCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/desktop-cart-item.component';
import { ExpandedCartLayoutComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/expanded-cart-layout.component';
import { MobileCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/mobile-cart-item.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { AccountService } from 'src/app/services/account/account.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';
import {
  Remittance,
  RemittanceService,
} from 'src/app/services/updates/remittance.service';

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
  ],
  templateUrl: './purchase-record.component.html',
  styles: ``,
})
export class PurchaseRecordComponent {
  cartRecords: CartRecord[] = [];
  remittance: Remittance | null = null;
  showDetail = signal<Record<string | number, boolean>>({});
  CartRemittanceState = CartRemittanceState;
  CartFeedbackStateMap = CartFeedbackStateMap;

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly remittanceService: RemittanceService,
    public readonly responsive: ResponsiveService,
    private readonly accountService: AccountService,
  ) {
    this.shoppingCartService
      .getCartRecords()
      .pipe(takeUntilDestroyed())
      .subscribe((cartRecords) => {
        this.cartRecords = cartRecords;
      });

    this.remittanceService.listenRemittance((data) => (this.remittance = data));
  }

  updateShowDetail(id: string | number, show: boolean) {
    this.showDetail.update((prev) => ({ ...prev, [id]: show }));
  }

  updateCartRecord(recordId: string, state: CartRemittanceState) {
    this.shoppingCartService.updateRemittanceState(recordId, state);
  }
}
