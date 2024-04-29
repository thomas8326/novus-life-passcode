import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { CartItem } from 'src/app/models/cart';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FirebaseImgUrlDirective,
    TwCurrencyPipe,
    CurrencyPipe,
    CountHandlerComponent,
    MatIconModule,
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
    private readonly crystalProductService: CrystalProductService,
    public readonly responsive: ResponsiveService,
  ) {
    this.crystalProductService
      .getAllCrystals()
      .then((data) => (this.allCrystal = data));
    this.crystalProductService
      .getAllCrystalAccessories()
      .then((data) => (this.allCrystalAccessory = data));

    this.shoppingCartService
      .getCartItems()
      .pipe(takeUntilDestroyed())
      .subscribe((cartItems) => {
        this.cartItems = cartItems;
      });
  }

  removeCartItem(sku: string) {
    this.shoppingCartService.removeCartItem(sku);
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
      (acc, item) => acc + (item.totalPrice || 0),
      0,
    );
  }
}
