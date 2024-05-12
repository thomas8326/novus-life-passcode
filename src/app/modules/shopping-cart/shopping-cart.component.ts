import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
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

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    public readonly responsive: ResponsiveService,
    private readonly dialog: MatDialog,
  ) {
    this.shoppingCartService
      .getCartItems()
      .pipe(takeUntilDestroyed())
      .subscribe((cartItems) => {
        this.cartItems = cartItems;
      });
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

  getTotal(crystal?: Crystal, accessory?: CrystalAccessory) {
    const crystalPrice = crystal?.price ?? 0;
    const accessoryPrice = accessory?.price ?? 0;
    const crystalDiscount = crystal?.mythicalBeastDiscount ?? 0;

    return Number(crystalPrice) + Number(accessoryPrice) - crystalDiscount;
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
}
