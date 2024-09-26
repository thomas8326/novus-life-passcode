import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { CrystalKnowledgeComponent } from 'src/app/components/crystal-knowledge/crystal-knowledge.component';
import { RecipientInfoDisplayComponent } from 'src/app/components/recipient-information/recipient-info-display.component';
import { RemittanceFormComponent } from 'src/app/components/remittance-information/remittance-form.component';
import { TotalPriceComponent } from 'src/app/components/total-price/total-price.component';
import { UserInfoSelectorComponent } from 'src/app/components/user-info-selector/user-info-selector.component';
import { WearerFormComponent } from 'src/app/components/wearer-information/wearer-form.component';
import { Remittance, Wearer } from 'src/app/models/account';
import { CartItem } from 'src/app/models/cart';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { DesktopCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/desktop-cart-item.component';
import { ExpandedCartLayoutComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/expanded-cart-layout.component';
import { MobileCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/mobile-cart-item.component';
import { ExtraIntroductionComponent } from 'src/app/modules/shopping-cart/extra-introduction/extra-Introduction.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { AccountService } from 'src/app/services/account/account.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { ScrollbarService } from 'src/app/services/scrollbar/scrollbar.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';
import {
  DEFAULT_PRICES,
  Prices,
  PricesService,
} from 'src/app/services/updates/prices.service';
import {
  Recipient,
  RecipientService,
} from 'src/app/services/updates/recipient.service';

enum ShoppingStatus {
  Cart,
  Checkout,
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    UserInfoSelectorComponent,
    CheckboxComponent,
    TwCurrencyPipe,
    AsyncPipe,
    JsonPipe,
    ConfirmDialogComponent,
    DesktopCartItemComponent,
    MobileCartItemComponent,
    ExpandedCartLayoutComponent,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    RecipientInfoDisplayComponent,
    RemittanceFormComponent,
    TotalPriceComponent,
    ExtraIntroductionComponent,
    WearerFormComponent,
    CrystalKnowledgeComponent,
  ],
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private shoppingCartService = inject(ShoppingCartService);
  private recipientService = inject(RecipientService);
  private accountService = inject(AccountService);
  private pricesService = inject(PricesService);
  public responsive = inject(ResponsiveService);
  private scrollbarService = inject(ScrollbarService);

  Status = ShoppingStatus;

  cartItems = toSignal(
    toObservable(this.accountService.myAccount).pipe(
      switchMap((account) =>
        this.shoppingCartService.getCartItems(account?.uid ?? ''),
      ),
    ),
    {
      initialValue: [] as CartItem[],
    },
  );
  device = toSignal(this.responsive.getDeviceObservable());

  selectedItemSum = computed(() =>
    this.selectedCartItem().reduce(
      (acc, item) => acc + (item.prices.totalPrice || 0) * item.quantity,
      0,
    ),
  );
  selectedBoxPrice = computed(() =>
    this.wantsBox() ? this.prices().boxPrice : 0,
  );
  selectedDeliveryFee = computed(() =>
    this.selectedItemSum() + this.selectedBoxPrice() >
    this.prices().freeTransportation
      ? 0
      : this.deliveryFee(),
  );

  recipient = signal<Recipient | null>(null);
  wearerForm = signal<{ data: Wearer | null; valid: boolean }>({
    data: null,
    valid: false,
  });
  remittanceForm = signal<{ data: Remittance | null; valid: boolean }>({
    data: null,
    valid: false,
  });
  tempImage = signal<{ src: string; file: File } | null>(null);
  shoppingStatus = signal(ShoppingStatus.Cart);
  showDetail = signal<Record<string | number, boolean>>({});
  prices = signal<Prices>(DEFAULT_PRICES);
  deliveryFee = signal(0);
  wantsBox = signal(false);
  touched = signal(false);
  allCrystal = signal<Map<string, Crystal>>(new Map());
  allCrystalAccessory = signal<Map<string, CrystalAccessory>>(new Map());
  selectedCartItem = signal<CartItem[]>([]);
  knowledgeChecked = signal(false);

  constructor() {
    effect(() => {
      this.shoppingStatus();
      this.scrollbarService.scrollToTop();
    });
    this.recipientService.listenRecipient((data) => this.recipient.set(data));
    this.pricesService.listenPrices((prices) => this.prices.set(prices));
  }

  onRemoveCartItem(sku: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '移除產品',
        message: '你確定將此產品從購物車中移除嗎?',
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.shoppingCartService.removeCartItem(sku);
      }
    });
  }

  updateQuantity(sku: string, quantity: number) {
    this.shoppingCartService.updateQuantity(sku, quantity);
  }

  getCrystal(sku: string) {
    return this.allCrystal().get(sku);
  }

  getCrystalAccessory(sku: string) {
    return this.allCrystalAccessory().get(sku);
  }

  onSelectAllCartItem(checked: boolean) {
    this.selectedCartItem.set(checked ? this.cartItems() : []);
  }

  onSelectCartItem(checked: boolean, cartItem: CartItem) {
    this.selectedCartItem.update((prev) =>
      checked
        ? [...prev, cartItem]
        : prev.filter((item) => item.cartId !== cartItem.cartId),
    );
  }

  onCheckout() {
    if (this.selectedCartItem().length > 0) {
      this.shoppingStatus.set(this.Status.Checkout);
    }
  }

  onOrder() {
    this.touched.set(true);
    const userUid = this.accountService.myAccount()?.uid;

    if (!this.remittanceForm().valid || !this.wearerForm().valid || !userUid) {
      this.scrollbarService.scrollToTop();
      return;
    }

    const remittance = this.remittanceForm().data!;
    const wearer = this.wearerForm().data!;

    const uploadCallback = () =>
      wearer.hasBracelet
        ? this.shoppingCartService.uploadBraceletImage(
            userUid,
            this.tempImage()!.file,
          )
        : Promise.resolve('');

    uploadCallback().then((url) => {
      this.shoppingCartService.checkoutCart(
        this.selectedCartItem(),
        remittance,
        { ...wearer, braceletImage: url },
        this.selectedBoxPrice(),
        this.selectedDeliveryFee(),
      );
      this.router.navigate(['/purchase-record']);
    });
  }

  updateShowDetail(id: string | number, show: boolean) {
    this.showDetail.update((prev) => ({ ...prev, [id]: show }));
  }

  onDeliveryFeeChange(price: number) {
    this.deliveryFee.set(price);
  }

  onRemittanceChange(form: { data: Remittance | null; valid: boolean }) {
    this.remittanceForm.set(form);
  }

  onWearerChange(form: { data: Wearer | null; valid: boolean }) {
    this.wearerForm.set(form);
  }

  onCancel() {
    this.shoppingStatus.set(ShoppingStatus.Cart);
    this.selectedCartItem.set([]);
  }
}
