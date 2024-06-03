import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { CartItem } from 'src/app/models/cart';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { AccessoryCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/accessory-cart-item.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
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
    AccessoryCartItemComponent,
    CommonModule,
    AsyncPipe,
    FirebaseImgUrlDirective,
    TwCurrencyPipe,
    CurrencyPipe,
    CountHandlerComponent,
    MatIconModule,
    DividerComponent,
    CheckboxComponent,
    MatButtonModule,
    ConfirmDialogComponent,
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

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly remittanceService: RemittanceService,
    public readonly responsive: ResponsiveService,
    private readonly dialog: MatDialog,
  ) {
    this.shoppingCartService
      .getCartItems()
      .pipe(takeUntilDestroyed())
      .subscribe((cartItems) => {
        this.cartItems = cartItems;
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
      (acc, item) => acc + (item.itemPrice || 0) * item.quantity,
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
    }
  }
}
