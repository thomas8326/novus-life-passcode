import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { AccessoryCartItem } from 'src/app/models/cart';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-accessory-cart-item',
  standalone: true,
  imports: [
    TwCurrencyPipe,
    MatIconModule,
    FirebaseImgUrlDirective,
    CountHandlerComponent,
  ],
  template: `
    @if (accessoryCartItem) {
      @if (desktop) {
        <div
          class="grid grid-cols-[repeat(24,minmax(0,_1fr))] gap-2 items-center my-2"
        >
          <div class="col-[1_/_span_14] flex items-center gap-2 ml-8">
            <img
              class="w-[80px] aspect-square object-cover"
              appFirebaseImgUrl
              [imgUrl]="accessoryCartItem.accessory.image_url"
            />
            <div>{{ accessoryCartItem.accessory.name }}</div>
          </div>
          <div class="col-span-3 flex items-center justify-center">
            {{ accessoryCartItem.accessory.price | twCurrency }}
          </div>
          <div class="col-span-3 flex items-center justify-center">
            {{ accessoryCartItem.quantity }}
          </div>
          <div class="col-span-4 flex items-center justify-center">
            {{
              accessoryCartItem.accessory.price * accessoryCartItem.quantity
                | twCurrency
            }}
          </div>
          <!-- <div class="col-span-2 flex items-center">
            @switch (buttonType) {
              @case ('delete') {
                <button
                  mat-icon-button
                  (click)="deleteItem.emit(accessoryCartItem)"
                  class="text-red-600 text-desktopSmall"
                >
                  刪除
                </button>
              }
            }
          </div> -->
        </div>
      } @else {
        <div class="flex items-center gap-1.5 my-2">
          <div class="flex items-center">
            @switch (buttonType) {
              @case ('delete') {
                <button
                  mat-icon-button
                  (click)="deleteItem.emit(accessoryCartItem)"
                  class="w-[26px] bg-red-600 text-white font-bold border border-red-800 px-1.5 py-1 mr-1.5 rounded text-mobileSmall"
                >
                  刪除
                </button>
              }
            }
          </div>
          <div class="w-[60px] flex-none">
            <img
              class="w-full h-full aspect-square object-cover"
              appFirebaseImgUrl
              [imgUrl]="accessoryCartItem.accessory.image_url"
            />
          </div>
          <div class="flex-1 h-full">
            <div class="font-bold h-full line-clamp-2 text-mobileContent">
              {{ accessoryCartItem.accessory.name }}
            </div>
            <div class="text-mobileSmall">
              {{ accessoryCartItem.accessory.price | twCurrency }}
            </div>
          </div>
          <div class="w-[40px] flex-none text-center">
            {{ accessoryCartItem.quantity }}
          </div>
          <div class="w-[80px] flex-none text-center">
            {{
              accessoryCartItem.accessory.price * accessoryCartItem.quantity
                | twCurrency
            }}
          </div>
        </div>
      }
    }
  `,
  styles: ``,
})
export class AccessoryCartItemComponent {
  @Input() desktop = false;
  @Input() accessoryCartItem: AccessoryCartItem | null = null;
  @Input() itemTitle = '';
  @Input() buttonType: 'delete' | 'none' = 'none';
  @Output() deleteItem = new EventEmitter<AccessoryCartItem>();

  constructor() {}
}
