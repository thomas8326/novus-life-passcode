import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { switchMap } from 'rxjs';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { ExtraBuyComponent } from 'src/app/components/extra-buy/extra-buy.component';
import { RecipientInformationComponent } from 'src/app/components/recipient-information/recipient-information.component';
import { RemittanceInfoDisplayComponent } from 'src/app/components/remittance-information/remittance-info-display';
import { RemittanceStateComponent } from 'src/app/components/remittance-state/remittance-state.component';
import { TotalPriceComponent } from 'src/app/components/total-price/total-price.component';
import { WearerInfoDisplayComponent } from 'src/app/components/wearer-information/wear-info-display';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { GenderMap } from 'src/app/enums/gender.enum';
import { RemittanceStateType } from 'src/app/models/account';
import { CartFeedbackStateMap, CartRecord } from 'src/app/models/cart';
import { Pay } from 'src/app/models/pay';
import { DesktopCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/desktop-cart-item.component';
import { ExpandedCartLayoutComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/expanded-cart-layout.component';
import { MobileCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/mobile-cart-item.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { AccountService } from 'src/app/services/account/account.service';
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
    TotalPriceComponent,
    DatePipe,
    FirebaseImgUrlDirective,
    ExtraBuyComponent,
    RemittanceInfoDisplayComponent,
    WearerInfoDisplayComponent,
  ],
  templateUrl: './purchase-record.component.html',
  styles: ``,
})
export class PurchaseRecordComponent {
  private shoppingCartService = inject(ShoppingCartService);
  private notifyService = inject(NotifyService);
  private accountService = inject(AccountService);
  public responsive = inject(ResponsiveService);

  cartRecords = toSignal(
    toObservable(this.accountService.myAccount).pipe(
      switchMap((account) =>
        this.shoppingCartService.getCartRecords(account?.uid ?? ''),
      ),
    ),
    {
      initialValue: [] as CartRecord[],
    },
  );
  showDetail = signal<Record<string | number, boolean>>({});
  CartRemittanceState = RemittanceStateType;
  CartFeedbackStateMap = CartFeedbackStateMap;
  GenderMap = GenderMap;

  device = toSignal(this.responsive.getDeviceObservable());

  constructor() {
    this.notifyService.readNotify('cart', 'customer');
  }

  onUpdateShowDetail(id: string | number, show: boolean) {
    this.showDetail.update((prev) => ({ ...prev, [id]: show }));
  }

  onUpdateCartRecordRemittanceState(recordId: string, pay: Pay) {
    this.shoppingCartService.payCartRecord(recordId, pay);
    this.notifyService.updateNotify('cart', 'customer');
  }
}
