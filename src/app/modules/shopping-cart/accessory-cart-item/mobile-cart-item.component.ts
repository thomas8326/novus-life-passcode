import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
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
    FirebaseImgUrlDirective,
    TwCurrencyPipe,
    AccessoryCartItemComponent,
    CountHandlerComponent,
  ],
  template: `
    @if (cart) {
      @if (showCheckbox) {
        <div
          class="bg-white border-b border-primary py-2 flex justify-between p-3 items-center"
        >
          <app-checkbox
            [checked]="checked"
            (checkedChange)="select.emit($event)"
          ></app-checkbox>
          <div class="col-span-2 text-center">
            <button
              mat-mini-fab
              (click)="cart.cartId && remove.emit(cart.cartId)"
            >
              <mat-icon class="text-white">delete</mat-icon>
            </button>
          </div>
        </div>
      }
      <div class="bg-white p-3">
        <label class="flex items-center gap-2">
          <div class="flex flex-col flex-1">
            <div class="flex items-center gap-1.5">
              <div class="w-[80px] flex-none">
                <img
                  class="w-full h-full aspect-square object-cover"
                  appFirebaseImgUrl
                  [imgUrl]="cart.crystal.image_url"
                />
              </div>
              <div class="flex-1 h-full">
                <div class="font-bold h-full line-clamp-2 text-[16px]">
                  {{ cart.crystal.name }}
                </div>
                <div>
                  {{ cart.crystal.price | twCurrency }}
                </div>
              </div>
            </div>

            <app-divider>必選款式</app-divider>
            @for (
              accessoryCartItem of cart.mandatoryAccessories;
              track accessoryCartItem.accessory.id
            ) {
              <app-accessory-cart-item
                [desktop]="false"
                [accessoryCartItem]="accessoryCartItem"
              ></app-accessory-cart-item>
            }
            @if (cart.optionalAccessories.length) {
              <app-divider>加購款式</app-divider>
              @for (
                accessoryCartItem of cart.optionalAccessories;
                track accessoryCartItem.accessory.id
              ) {
                <app-accessory-cart-item
                  [desktop]="false"
                  [accessoryCartItem]="accessoryCartItem"
                ></app-accessory-cart-item>
              }
            }
            @if (cart.pendantAccessories.length) {
              <app-divider>吊飾/隨意扣</app-divider>
              @for (
                accessoryCartItem of cart.pendantAccessories;
                track accessoryCartItem.accessory.id
              ) {
                <app-accessory-cart-item
                  [desktop]="false"
                  [accessoryCartItem]="accessoryCartItem"
                ></app-accessory-cart-item>
              }
            }
          </div>
        </label>
      </div>
      <div class="bg-white border-t border-primary p-4 flex flex-col gap-y-1">
        <div class="flex justify-between w-full">
          <div class="text-left block content-center">水晶金額</div>
          <div class="text-right">
            {{ cart.prices.crystalPrice | twCurrency }}
          </div>
        </div>
        <div class="flex justify-between w-full">
          <div class="text-left block content-center">加購款式金額(折扣後)</div>
          <div class="text-right">
            {{ cart.prices.optionalItemsPrice | twCurrency }}
          </div>
        </div>
        <div class="flex justify-between w-full">
          <div class="text-left block content-center">必選款式金額(折扣後)</div>
          <div class="text-right">
            {{ cart.prices.mandatoryItemsPrice | twCurrency }}
          </div>
        </div>
        <div class="flex items-center justify-between w-full">
          <div class="text-left block content-center">
            吊飾/隨意扣金額(折扣後)
          </div>
          <div class="text-right">
            {{ cart.prices.pendantItemsPrice | twCurrency }}
          </div>
        </div>
        <div class="flex justify-between w-full">
          <div class="text-left block content-center">產品數量</div>
          <div class="flex justify-end">
            @if (showTextQuantity) {
              {{ cart.quantity }}
            } @else {
              <app-count-handler
                [quantity]="cart.quantity"
                (quantityChange)="
                  cart.cartId &&
                    updateQuantity.emit({
                      cartId: cart.cartId,
                      quantity: $event
                    })
                "
                containerStyles="w-[100px] h-8"
              ></app-count-handler>
            }
          </div>
        </div>
        <div class="flex items-center justify-between w-full">
          <div class="text-left block content-center">總付款金額</div>
          <div class="text-right text-mobileSubTitle font-bold">
            {{ cart.prices.discountPrice * cart.quantity | twCurrency }}
          </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class MobileCartItemComponent {
  @Input() showCheckbox = true;
  @Input() showTextQuantity = false;
  @Input() cart: CartItem | null = null;
  @Input() checked = false;
  @Output() select = new EventEmitter<boolean>();
  @Output() remove = new EventEmitter<string>();
  @Output() updateQuantity = new EventEmitter<{
    cartId: string;
    quantity: number;
  }>();
}
