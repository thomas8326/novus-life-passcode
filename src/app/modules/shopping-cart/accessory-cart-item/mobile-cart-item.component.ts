import {
  Component,
  computed,
  EventEmitter,
  input,
  model,
  Output,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { ImageLoaderComponent } from 'src/app/components/image-loader/image-loader.component';
import { CartItem } from 'src/app/models/cart';
import { AccessoryCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/accessory-cart-item.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-mobile-cart-item',
  standalone: true,
  imports: [
    DividerComponent,
    CheckboxComponent,
    MatIconModule,
    MatButton,
    ImageLoaderComponent,
    TwCurrencyPipe,
    AccessoryCartItemComponent,
    CountHandlerComponent,
  ],
  template: `
    @if (cart(); as cartItem) {
      @if (showCheckbox()) {
        <div
          class="border-b border-primary py-2 flex justify-between p-3 items-center"
        >
          <app-checkbox [(checked)]="checked"></app-checkbox>
          <div class="col-span-2 text-center">
            <button mat-mini-fab (click)="onRemove()">
              <mat-icon class="text-white">delete</mat-icon>
            </button>
          </div>
        </div>
      }
      <div class="p-3">
        <label class="flex items-center gap-2">
          <div class="flex flex-col flex-1">
            <div class="flex items-center gap-1.5">
              <div class="w-[80px] flex-none">
                <app-image-loader
                  class="w-full h-full aspect-square object-cover"
                  [src]="cartItem.crystal.image_url"
                />
              </div>
              <div class="flex-1 h-full">
                <div class="font-bold h-full line-clamp-2 text-[16px]">
                  {{ cartItem.crystal.name }}
                </div>
                <div>
                  {{ cartItem.crystal.price | twCurrency }}
                </div>
              </div>
            </div>

            <app-divider textStyles="px-2">必選款式</app-divider>
            @for (
              accessoryCartItem of cartItem.mandatoryAccessories;
              track accessoryCartItem.accessory.id
            ) {
              <app-accessory-cart-item
                [isDesktop]="false"
                [item]="accessoryCartItem"
              ></app-accessory-cart-item>
            }
            @if (cartItem.optionalAccessories.length) {
              <app-divider textStyles="px-2">加購款式</app-divider>
              @for (
                accessoryCartItem of cartItem.optionalAccessories;
                track accessoryCartItem.accessory.id
              ) {
                <app-accessory-cart-item
                  [isDesktop]="false"
                  [item]="accessoryCartItem"
                ></app-accessory-cart-item>
              }
            }
            @if (cartItem.pendantAccessories.length) {
              <app-divider textStyles="px-2">吊飾/隨意扣</app-divider>
              @for (
                accessoryCartItem of cartItem.pendantAccessories;
                track accessoryCartItem.accessory.id
              ) {
                <app-accessory-cart-item
                  [isDesktop]="false"
                  [item]="accessoryCartItem"
                ></app-accessory-cart-item>
              }
            }
          </div>
        </label>
      </div>
      <div class="border-t border-primary p-4 flex flex-col gap-y-1">
        <div class="flex justify-between w-full">
          <div class="text-left block content-center">水晶金額</div>
          <div class="text-right">
            {{ cartItem.prices.crystalPrice | twCurrency }}
          </div>
        </div>
        <div class="flex justify-between w-full">
          <div class="text-left block content-center">加購款式金額(折扣後)</div>
          <div class="text-right">
            {{ cartItem.prices.optionalItemsPrice | twCurrency }}
          </div>
        </div>
        <div class="flex justify-between w-full">
          <div class="text-left block content-center">必選款式金額(折扣後)</div>
          <div class="text-right">
            {{ cartItem.prices.mandatoryItemsPrice | twCurrency }}
          </div>
        </div>
        <div class="flex items-center justify-between w-full">
          <div class="text-left block content-center">
            吊飾/隨意扣金額(折扣後)
          </div>
          <div class="text-right">
            {{ cartItem.prices.pendantItemsPrice | twCurrency }}
          </div>
        </div>
        <div class="flex justify-between w-full">
          <div class="text-left block content-center">產品數量</div>
          <div class="flex justify-end">
            @if (showTextQuantity()) {
              {{ cartItem.quantity }}
            } @else {
              <app-count-handler
                [quantity]="cartItem.quantity"
                (quantityChange)="onUpdateQuantity($event)"
                containerStyles="w-[100px] h-8"
              ></app-count-handler>
            }
          </div>
        </div>
        <div class="flex items-center justify-between w-full">
          <div class="text-left block content-center">付款金額</div>
          <div class="text-right text-mobileSubTitle font-bold">
            {{ totalPrice() | twCurrency }}
          </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class MobileCartItemComponent {
  showCheckbox = input(true);
  showTextQuantity = input(false);
  cart = input<CartItem | null>(null);
  checked = model(false);

  @Output() select = new EventEmitter<boolean>();
  @Output() remove = new EventEmitter<string>();
  @Output() updateQuantity = new EventEmitter<{
    cartId: string;
    quantity: number;
  }>();

  totalPrice = computed(() => {
    const cartValue = this.cart();
    return cartValue ? cartValue.prices.discountPrice * cartValue.quantity : 0;
  });

  onRemove() {
    const cartValue = this.cart();
    if (cartValue && cartValue.cartId) {
      this.remove.emit(cartValue.cartId);
    }
  }

  onUpdateQuantity(quantity: number) {
    const cartValue = this.cart();
    if (cartValue && cartValue.cartId) {
      this.updateQuantity.emit({ cartId: cartValue.cartId, quantity });
    }
  }
}
