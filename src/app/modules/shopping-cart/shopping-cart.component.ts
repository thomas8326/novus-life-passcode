import { AsyncPipe } from '@angular/common';
import { Component, ViewChild, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BankSelectorComponent } from 'src/app/components/bank-selector/bank-selector.component';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { RecipientInformationComponent } from 'src/app/components/recipient-information/recipient-information.component';
import { RemittanceInformationComponent } from 'src/app/components/remittance-information/remittance-information.component';
import { TotalPriceComponent } from 'src/app/components/total-price/total-price.component';
import { Remittance } from 'src/app/models/account';
import { CartItem } from 'src/app/models/cart';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { DesktopCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/desktop-cart-item.component';
import { ExpandedCartLayoutComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/expanded-cart-layout.component';
import { MobileCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/mobile-cart-item.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { AccountService } from 'src/app/services/account/account.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
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
    CheckboxComponent,
    TwCurrencyPipe,
    AsyncPipe,
    ConfirmDialogComponent,
    DesktopCartItemComponent,
    MobileCartItemComponent,
    ExpandedCartLayoutComponent,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    RecipientInformationComponent,
    BankSelectorComponent,
    RemittanceInformationComponent,
    TotalPriceComponent,
  ],
  templateUrl: './shopping-cart.component.html',
  styles: ``,
})
export class ShoppingCartComponent {
  @ViewChild(RemittanceInformationComponent)
  RemittanceInformationComponent!: RemittanceInformationComponent;

  cartItems: CartItem[] = [];

  allCrystal: Map<string, Crystal> = new Map();
  allCrystalAccessory: Map<string, CrystalAccessory> = new Map();

  selectedCartItem = signal<CartItem[]>([]);
  selectedItemSum = computed(() =>
    this.selectedCartItem().reduce(
      (acc, item) => acc + (item.prices.totalPrice || 0) * item.quantity,
      0,
    ),
  );

  recipient: Recipient | null = null;
  remittance: Remittance | null = null;

  shoppingStatus = signal(ShoppingStatus.Cart);
  Status = ShoppingStatus;

  myAccount = this.accountService.getMyAccount();
  showDetail = signal<Record<string | number, boolean>>({});

  prices = signal<Prices>(DEFAULT_PRICES);
  deliveryFee = signal<number>(0);

  touched = false;

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly recipientService: RecipientService,
    public readonly responsive: ResponsiveService,
    private readonly dialog: MatDialog,
    private readonly accountService: AccountService,
    private readonly router: Router,
    private readonly pricesService: PricesService,
  ) {
    this.shoppingCartService
      .getCartItems()
      .pipe(takeUntilDestroyed())
      .subscribe((cartItems) => {
        this.cartItems = cartItems;
      });

    this.recipientService.listenRecipient((data) => {
      this.recipient = data;
    });

    this.accountService.myAccount$.subscribe((myAccount) => {
      if (myAccount) {
        this.remittance = {
          name: myAccount.name,
          phone: myAccount.phone,
          paymentType: 'normal',
          delivery: {
            zipCode: myAccount.zipCode,
            address: myAccount.address,
          },
          bank: { code: '', name: '', account: '' },
        };
      }
    });

    this.pricesService.listenPrices((prices) => this.prices.set(prices));
  }

  onRemoveCartItem(sku: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '刪除資料',
        message: '刪除後無法回覆資料，確定要刪除嗎？',
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
    return this.allCrystal.get(sku);
  }

  getCrystalAccessory(sku: string) {
    return this.allCrystalAccessory.get(sku);
  }

  onSelectAllCartItem(checked: boolean, cartItem: CartItem[]) {
    this.selectedCartItem.set(checked ? cartItem : []);
  }

  onSelectCartItem(checked: boolean, cartItem: CartItem) {
    if (checked) {
      this.selectedCartItem.update((prev) => prev.concat(cartItem));
    } else {
      this.selectedCartItem.update((prev) =>
        prev.filter((item) => item.cartId !== cartItem.cartId),
      );
    }
  }

  onCheckout() {
    if (this.selectedCartItem().length > 0) {
      this.shoppingStatus.set(this.Status.Checkout);
    }
  }

  onOrder() {
    this.touched = true;

    if (this.RemittanceInformationComponent.formGroup.invalid) {
      return;
    }

    const remittance = this.RemittanceInformationComponent.formGroup
      .value as Remittance;

    this.shoppingCartService.checkoutCart(
      this.selectedCartItem(),
      remittance,
      this.deliveryFee(),
    );
    this.router.navigate(['/purchase-record']);
  }

  updateShowDetail(id: string | number, show: boolean) {
    this.showDetail.update((prev) => ({ ...prev, [id]: show }));
  }

  onDeliveryFeeChange(price: number) {
    this.deliveryFee.set(price);
  }

  onCancel() {
    this.shoppingStatus.set(ShoppingStatus.Cart);
    this.selectedCartItem.set([]);
  }
}
