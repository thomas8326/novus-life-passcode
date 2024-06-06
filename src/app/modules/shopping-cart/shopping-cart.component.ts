import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
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
  Remittance,
  RemittanceService,
} from 'src/app/services/updates/remittance.service';

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
  ],
  templateUrl: './shopping-cart.component.html',
  styles: ``,
})
export class ShoppingCartComponent {
  cartItems: CartItem[] = [];

  allCrystal: Map<string, Crystal> = new Map();
  allCrystalAccessory: Map<string, CrystalAccessory> = new Map();

  selectedCartItem: CartItem[] = [];
  remittance: Remittance | null = null;

  shoppingStatus = signal(ShoppingStatus.Cart);
  Status = ShoppingStatus;

  myAccount$ = this.accountService.myAccount$;

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly remittanceService: RemittanceService,
    public readonly responsive: ResponsiveService,
    private readonly dialog: MatDialog,
    private accountService: AccountService,
  ) {
    this.shoppingCartService
      .getCartItems()
      .pipe(takeUntilDestroyed())
      .subscribe((cartItems) => {
        this.cartItems = cartItems;
        console.log(cartItems);
      });

    this.remittanceService.listenRemittance((data) => (this.remittance = data));
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
    this.selectedCartItem = checked ? cartItem : [];
  }

  onSelectCartItem(checked: boolean, cartItem: CartItem) {
    if (checked) {
      this.selectedCartItem.push(cartItem);
    } else {
      this.selectedCartItem = this.selectedCartItem.filter(
        (item) => item.cartId !== cartItem.cartId,
      );
    }
  }

  getSelectedTotalPrices() {
    return this.selectedCartItem.reduce(
      (acc, item) => acc + (item.prices.totalPrice || 0) * item.quantity,
      0,
    );
  }

  onBuy() {
    const status = this.shoppingStatus();
    if (status === this.Status.Cart) {
      if (this.selectedCartItem.length > 0) {
        this.shoppingStatus.set(this.Status.Checkout);
      }
    } else {
      this.shoppingCartService.checkout(this.selectedCartItem);
      this.shoppingStatus.set(this.Status.Cart);
    }
  }
}
