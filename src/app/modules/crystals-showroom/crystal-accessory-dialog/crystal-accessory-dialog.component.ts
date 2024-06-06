import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { AccessoryTypeText } from 'src/app/consts/accessory_type.const';
import {
  CrystalAccessoryType,
  CrystalMythicalBeastType,
  CrystalPendantType,
} from 'src/app/enums/accessory-type.enum';
import { AccessoryCartItem } from 'src/app/models/cart';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { CrystalAccessoryCardComponent } from 'src/app/modules/crystals-showroom/crystal-accessory-card/crystal-accessory-card.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';

@Component({
  selector: 'app-crystal-accessory-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    CrystalAccessoryCardComponent,
    TwCurrencyPipe,
    CountHandlerComponent,
  ],
  template: `
    <div class="flex flex-col h-full">
      <h2 mat-dialog-title>
        <span class="text-[24px] font-bold my-4">配件</span>
      </h2>
      <div mat-dialog-content class="flex-1">
        <div class="flex flex-col overflow-auto">
          <div class="py-4 flex-none">
            <mat-form-field appearance="outline">
              <mat-label>吊飾類型</mat-label>
              <mat-select
                [value]="accessoryTypeSubject.value"
                (valueChange)="onSelect($event)"
              >
                @for (key of accessoryTypeKeys; track $index) {
                  <mat-option [value]="key">
                    {{ ACCESSORY_TYPE_TEXT[key] }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
          <div class="flex-1 flex flex-col gap-4">
            <div class="flex flex-col bg-green-100 rounded-md overflow-hidden">
              <div class="flex item-center justify-center h-auto py-2">
                <div
                  class="bg-white py-2 px-4 rounded-full w-[60%] text-center"
                >
                  <div
                    class="lg:tracking-[50px] w-full lg:translate-x-4 text-green-700 font-bold text-[20px]"
                  >
                    必選款
                  </div>
                </div>
              </div>
              @if (lessThanDiscountAccessories.length === 0) {
                <div class="flex items-center justify-center py-5">
                  暫無合適產品
                </div>
              } @else {
                <div
                  class="grid grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] gap-4 p-4 justify-center letter"
                >
                  @for (data of lessThanDiscountAccessories; track data.id) {
                    @if (data.id) {
                      <label
                        class="border-2 p-2 relative"
                        [ngClass]="
                          selected.checked
                            ? 'border-blue-700'
                            : 'cursor-pointer border-transparent hover:border-blue-300'
                        "
                      >
                        <input
                          type="checkbox"
                          name="accessory"
                          class="appearance-none hidden"
                          [value]="data"
                          [checked]="selectedAccessoryMap().has(data.id || '')"
                          (change)="onSelectAccessory(data, $event)"
                          #selected
                        />
                        <app-crystal-accessory-card
                          [crystalAccessory]="data"
                        ></app-crystal-accessory-card>

                        @if (!dialogData.singleSelect && selected.checked) {
                          <div
                            class="absolute top-4 right-4 w-[100px] bg-white"
                          >
                            <app-count-handler
                              [quantity]="
                                selectedAccessoryMap().get(data.id)?.quantity ||
                                1
                              "
                              (quantityChange)="
                                onUpdateSelectedQuantity(data, $event)
                              "
                              [maxCount]="99"
                            ></app-count-handler>
                          </div>
                        }
                      </label>
                    }
                  }
                </div>
              }
            </div>
            <div class="flex flex-col bg-red-100 rounded-md overflow-hidden">
              <div class="flex item-center justify-center h-auto py-2">
                <div
                  class="bg-white py-2 px-4 rounded-full w-[60%] text-center"
                >
                  <div
                    class="lg:tracking-[50px] w-full lg:translate-x-4 text-red-400 font-bold text-[20px]"
                  >
                    升級更換
                  </div>
                </div>
              </div>
              @if (greaterThanDiscountAccessories.length === 0) {
                <div class="flex items-center justify-center py-5">
                  暫無合適產品
                </div>
              } @else {
                <div
                  class="grid grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] gap-2 p-4 justify-center letter"
                >
                  @for (data of greaterThanDiscountAccessories; track data.id) {
                    @if (data.id) {
                      <label
                        class="border-2 p-2 relative"
                        [ngClass]="
                          selected.checked
                            ? 'border-blue-700'
                            : 'cursor-pointer border-transparent hover:border-blue-300'
                        "
                      >
                        <input
                          type="checkbox"
                          name="accessory"
                          class="appearance-none hidden"
                          [value]="data"
                          [checked]="selectedAccessoryMap().has(data.id)"
                          (change)="onSelectAccessory(data, $event)"
                          #selected
                        />

                        <app-crystal-accessory-card
                          [crystalAccessory]="data"
                        ></app-crystal-accessory-card>

                        @if (!dialogData.singleSelect && selected.checked) {
                          <div
                            class="absolute top-4 right-4 w-[100px] bg-white"
                          >
                            <app-count-handler
                              [quantity]="
                                selectedAccessoryMap().get(data.id)?.quantity ||
                                1
                              "
                              (quantityChange)="
                                onUpdateSelectedQuantity(data, $event)
                              "
                              [maxCount]="99"
                            ></app-count-handler>
                          </div>
                        }
                      </label>
                    }
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div class="my-4 mx-8 flex flex-col lg:flex-row justify-between">
        <div class="py-4">總計：{{ showDiscountPriceText() }}</div>

        <div class="flex gap-2 items-center justify-end">
          <button
            [mat-dialog-close]="{ type: 'cancel' }"
            class="w-20 h-12 hover:bg-gray-100 mx-2 rounded"
          >
            取消
          </button>
          <button
            [mat-dialog-close]="{
              type: 'confirm',
              accessories: selectedAccessories(),
              originalPrice: originalPrice(),
              discountPrice: discountPrice(),
              showDiscountPriceText: showDiscountPriceText()
            }"
            class="w-20 h-12 bg-highLightHover mx-2 rounded text-white font-bold disabled:bg-opacity-40 disabled:pointer-events-none"
            [disabled]="selectedAccessories().length === 0"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class CrystalAccessoryDialogComponent implements OnInit {
  private _selectedAccessoryMap: Map<string, AccessoryCartItem> = new Map();
  private twCurrencyPipe = new TwCurrencyPipe();

  ACCESSORY_TYPE_TEXT = AccessoryTypeText;
  accessoryTypeSubject = new BehaviorSubject<CrystalAccessoryType | null>(null);

  lessThanDiscountAccessories: CrystalAccessory[] = [];
  greaterThanDiscountAccessories: CrystalAccessory[] = [];

  selectedAccessories = signal<AccessoryCartItem[]>([]);
  selectedAccessoryMap = computed(() => {
    if (this.dialogData.singleSelect) {
      this._selectedAccessoryMap.clear();
    }

    this.selectedAccessories().forEach((data) =>
      this._selectedAccessoryMap.set(data.accessory.id || '', data),
    );
    return this._selectedAccessoryMap;
  });
  selectedSum = computed(() =>
    this.selectedAccessories().reduce(
      (acc, cur) => acc + cur.accessory.price * (cur?.quantity || 1),
      0,
    ),
  );
  originalPrice = computed(() => {
    const sum = this.selectedSum() - this.dialogData.discount;
    return sum < 0 ? 0 : sum;
  });

  discountPrice = computed(() => {
    const sum = this.selectedSum() - this.dialogData.discount;
    return sum < 0 ? 0 : sum;
  });
  showDiscountPriceText = computed(() =>
    this.selectedAccessories().length > 0
      ? `${this.selectedSum()} - ${this.dialogData.discount}(折扣) = ${this.twCurrencyPipe.transform(this.discountPrice())}`
      : 0,
  );

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      showSelections: CrystalAccessoryType[];
      discount: number;
      selectedAccessories: AccessoryCartItem[];
      singleSelect: boolean;
      hasWorkFee: boolean;
    },
    private readonly crystalProductService: CrystalProductService,
    private changeRef: ChangeDetectorRef,
  ) {
    this.accessoryTypeSubject
      .pipe(
        filter((data) => !!data),
        switchMap((type) => {
          const accessoryType = type || dialogData.showSelections[0];
          return this.crystalProductService
            .getCrystalAccessoriesByType(accessoryType)
            .pipe(
              map((data) => ({
                type: accessoryType,
                data,
              })),
            );
        }),
      )
      .subscribe(({ type, data: accessories }) => {
        const lessThanDiscount = [];
        const greaterThanDiscount = [];
        for (let accessory of accessories) {
          const workfee =
            dialogData.hasWorkFee && isMythicalBeastType(type) ? 100 : 0;
          const newItem = {
            ...accessory,
            id: accessory.id,
            price: accessory.price + workfee,
          };

          if (accessory.price <= dialogData.discount) {
            lessThanDiscount.push(newItem);
          } else {
            greaterThanDiscount.push(newItem);
          }
        }
        this.lessThanDiscountAccessories = lessThanDiscount;
        this.greaterThanDiscountAccessories = greaterThanDiscount;
      });

    this.accessoryTypeSubject.next(dialogData.showSelections[0]);
  }

  ngOnInit(): void {
    this.selectedAccessories.set(this.dialogData.selectedAccessories);
    this.changeRef.detectChanges();
  }

  onSelect(type: CrystalAccessoryType) {
    this.accessoryTypeSubject.next(type);
  }

  onSelectAccessory(data: CrystalAccessory, event: Event) {
    const inputEvent = event.target as HTMLInputElement;

    if (this.dialogData.singleSelect) {
      this.selectedAccessories.set([{ accessory: data, quantity: 1 }]);
    } else {
      this.selectedAccessories.update((prev) =>
        inputEvent.checked
          ? prev.concat({ accessory: data, quantity: 1 })
          : prev.filter((selected) => selected.accessory.id !== data.id),
      );
    }

    this.changeRef.detectChanges();
  }

  onUpdateSelectedQuantity(data: CrystalAccessory, quantity: number) {
    this.selectedAccessories.update((prev) =>
      prev.map((selected) =>
        selected.accessory.id === data.id
          ? { accessory: selected.accessory, quantity }
          : selected,
      ),
    );
  }

  get accessoryTypeKeys() {
    const beasts = Object.values(CrystalMythicalBeastType);
    const pendants = Object.values(CrystalPendantType);

    return [...beasts, ...pendants].filter((type) =>
      this.dialogData.showSelections.includes(type),
    ) as CrystalAccessoryType[];
  }
}

// Type guard to check if a value is a member of CrystalMythicalBeastType
function isMythicalBeastType(value: any): value is CrystalMythicalBeastType {
  return Object.values(CrystalMythicalBeastType).includes(value);
}
