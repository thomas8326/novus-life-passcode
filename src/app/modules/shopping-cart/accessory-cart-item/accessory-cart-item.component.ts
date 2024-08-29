import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { ImageLoaderComponent } from 'src/app/components/image-loader/image-loader.component';
import { AccessoryCartItem } from 'src/app/models/cart';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-accessory-cart-item',
  standalone: true,
  imports: [
    TwCurrencyPipe,
    MatIconModule,
    ImageLoaderComponent,
    CountHandlerComponent,
  ],
  template: `
    @let accessoryCartItemData = accessoryCartItem();
    @if (accessoryCartItemData) {
      @if (desktop()) {
        <div
          class="grid grid-cols-[repeat(24,minmax(0,_1fr))] gap-2 items-center my-2"
        >
          <div class="col-[1_/_span_14] flex items-center gap-2 ml-8">
            <app-image-loader
              class="w-[80px] aspect-square object-cover"
              [src]="accessoryCartItemData.accessory.image_url"
            />
            <div>{{ accessoryCartItemData.accessory.name }}</div>
          </div>
          <div class="col-span-3 flex items-center justify-center">
            {{ accessoryCartItemData.accessory.price | twCurrency }}
          </div>
          <div class="col-span-3 flex items-center justify-center">
            {{ accessoryCartItemData.quantity }}
          </div>
          <div class="col-span-4 flex items-center justify-center">
            {{ totalPrice() | twCurrency }}
          </div>
          @if (buttonType() === 'delete') {
            <div class="col-span-2 flex items-center">
              <button
                mat-icon-button
                (click)="onDeleteItem()"
                class="text-red-600 text-desktopSmall"
              >
                刪除
              </button>
            </div>
          }
        </div>
      } @else {
        <div class="flex items-center gap-1.5 my-2">
          @if (buttonType() === 'delete') {
            <div class="flex items-center">
              <button
                mat-icon-button
                (click)="onDeleteItem()"
                class="w-[26px] bg-red-600 text-white font-bold border border-red-800 px-1.5 py-1 mr-1.5 rounded text-mobileSmall"
              >
                刪除
              </button>
            </div>
          }
          <div class="w-[60px] flex-none">
            <app-image-loader
              class="w-full h-full aspect-square object-cover"
              [src]="accessoryCartItemData.accessory.image_url"
            />
          </div>
          <div class="flex-1 h-full">
            <div class="font-bold h-full line-clamp-2 text-mobileContent">
              {{ accessoryCartItemData.accessory.name }}
            </div>
            <div class="text-mobileSmall">
              {{ accessoryCartItemData.accessory.price | twCurrency }}
            </div>
          </div>
          <div class="w-[40px] flex-none text-center">
            {{ accessoryCartItemData.quantity }}
          </div>
          <div class="w-[80px] flex-none text-center">
            {{ totalPrice() | twCurrency }}
          </div>
        </div>
      }
    }
  `,
  styles: ``,
})
export class AccessoryCartItemComponent {
  desktop = signal(false);
  accessoryCartItem = signal<AccessoryCartItem | null>(null);
  itemTitle = signal('');
  buttonType = signal<'delete' | 'none'>('none');

  @Output() deleteItem = new EventEmitter<AccessoryCartItem>();

  totalPrice = computed(() => {
    const item = this.accessoryCartItem();
    return item ? item.accessory.price * item.quantity : 0;
  });

  @Input() set isDesktop(value: boolean) {
    this.desktop.set(value);
  }

  @Input() set item(value: AccessoryCartItem | null) {
    this.accessoryCartItem.set(value);
  }

  @Input() set title(value: string) {
    this.itemTitle.set(value);
  }

  @Input() set type(value: 'delete' | 'none') {
    this.buttonType.set(value);
  }

  onDeleteItem() {
    const item = this.accessoryCartItem();
    if (item) {
      this.deleteItem.emit(item);
    }
  }
}
