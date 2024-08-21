import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { CartItem } from 'src/app/models/cart';
import { AccessoryCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/accessory-cart-item.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-desktop-cart-item',
  standalone: true,
  imports: [
    DividerComponent,
    CheckboxComponent,
    MatIconModule,
    MatButtonModule,
    FirebaseImgUrlDirective,
    TwCurrencyPipe,
    AccessoryCartItemComponent,
    CountHandlerComponent,
  ],
  template: `
    @if (cart(); as cartItem) {
      @if (showCheckbox()) {
        <div
          class="border-b border-primary py-2 grid grid-cols-[repeat(24,minmax(0,_1fr))] gap-2 items-center p-3 sm:p-4"
        >
          <app-checkbox
            [checked]="checked()"
            (checkedChange)="onSelect($event)"
          ></app-checkbox>
          <div class="col-[2_/_span_21]"></div>
          <div class="col-span-2 text-center">
            <button mat-mini-fab (click)="onRemove()">
              <mat-icon class="text-white">delete</mat-icon>
            </button>
          </div>
        </div>
      }
      <div class="p-4">
        <div
          class="grid grid-cols-[repeat(24,minmax(0,_1fr))] gap-2 items-center"
        >
          <div class="col-span-12 flex items-center gap-2">
            <img
              class="w-[80px] aspect-square object-cover"
              appFirebaseImgUrl
              [imgUrl]="cartItem.crystal.image_url"
            />
            <div class="font-bold h-full line-clamp-2">
              {{ cartItem.crystal.name }}
            </div>
          </div>

          <div class="flex flex-col col-span-8">
            @for (emphasize of cartItem.crystal.emphasizes; track $index) {
              <div>{{ emphasize }}</div>
            }
          </div>
          <div class="flex items-center justify-center col-span-4">
            {{ cartItem.crystal.price | twCurrency }}
          </div>
        </div>
        <app-divider textStyles="px-2">必選款式</app-divider>
        @for (
          accessoryCartItem of cartItem.mandatoryAccessories;
          track accessoryCartItem.accessory.id
        ) {
          <app-accessory-cart-item
            [isDesktop]="true"
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
              [isDesktop]="true"
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
              [isDesktop]="true"
              [item]="accessoryCartItem"
            ></app-accessory-cart-item>
          }
        }
      </div>
      <div class="p-4 border-t border-primary">
        <div
          class="grid grid-cols-[1fr_max-content_max-content] gap-x-4 gap-y-2"
        >
          <div></div>
          <div class="text-left block content-center">水晶金額</div>
          <div class="text-right">
            {{ cartItem.prices.crystalPrice | twCurrency }}
          </div>
          <div></div>
          <div class="text-left block content-center">必選款式金額(折扣後)</div>
          <div class="text-right">
            {{ cartItem.prices.mandatoryItemsPrice | twCurrency }}
          </div>
          <div></div>
          <div class="text-left block content-center">加購款式金額(折扣後)</div>
          <div class="text-right">
            {{ cartItem.prices.optionalItemsPrice | twCurrency }}
          </div>
          <div></div>
          <div class="text-left block content-center">
            吊飾/隨意扣金額(折扣後)
          </div>
          <div class="text-right">
            {{ cartItem.prices.pendantItemsPrice | twCurrency }}
          </div>
          <div></div>
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
          <div></div>
          <div class="text-left block content-center">付款金額</div>
          <div class="text-right text-desktopSubTitle font-bold">
            {{ totalPrice() | twCurrency }}
          </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class DesktopCartItemComponent {
  showCheckbox = input(true);
  showTextQuantity = input(false);
  cart = input<CartItem | null>(null);
  checked = input(false);

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

  onSelect(isChecked: boolean) {
    this.select.emit(isChecked);
  }

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
