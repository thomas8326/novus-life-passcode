import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { BehaviorSubject, switchMap } from 'rxjs';
import { AccessoryTypeText } from 'src/app/consts/accessory_type.const';
import { CrystalAccessoryType } from 'src/app/enums/accessory-type.enum';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { CrystalAccessoryCardComponent } from 'src/app/modules/crystals-showroom/crystal-accessory-card/crystal-accessory-card.component';
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
                    class="tracking-[50px] w-full translate-x-4 text-green-700 font-bold text-[20px]"
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
                    <label
                      class="border-2 p-2"
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
                        [checked]="selectedAccessories.includes(data)"
                        (change)="onSelectAccessory(selected.checked, data)"
                        #selected
                      />
                      <app-crystal-accessory-card
                        [crystalAccessory]="data"
                      ></app-crystal-accessory-card>
                    </label>
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
                    class="tracking-[50px] w-full translate-x-4 text-red-400 font-bold text-[20px]"
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
                    <label
                      class="border-2 p-2"
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
                        [checked]="selectedAccessories.includes(data)"
                        (change)="onSelectAccessory(selected.checked, data)"
                        #selected
                      />
                      <app-crystal-accessory-card
                        [crystalAccessory]="data"
                      ></app-crystal-accessory-card>
                    </label>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div class="my-4">
        <mat-dialog-actions [align]="'end'">
          <button
            mat-dialog-close
            class="w-20 h-12 hover:bg-gray-100 mx-2 rounded"
          >
            取消
          </button>
          <button
            [mat-dialog-close]="{
              accessories: selectedAccessories
            }"
            class="w-20 h-12 bg-highLight hover:bg-highLightHover mx-2 rounded text-white font-bold"
          >
            加購
          </button>
        </mat-dialog-actions>
      </div>
    </div>
  `,
  styles: ``,
})
export class CrystalAccessoryDialogComponent implements OnInit {
  CrystalAccessoryType = CrystalAccessoryType;
  ACCESSORY_TYPE_TEXT = AccessoryTypeText;
  accessoryTypeSubject = new BehaviorSubject<CrystalAccessoryType>(
    CrystalAccessoryType.Satellite,
  );

  lessThanDiscountAccessories: CrystalAccessory[] = [];
  greaterThanDiscountAccessories: CrystalAccessory[] = [];
  selectedAccessories: CrystalAccessory[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      discount: number;
      defaultAccessory: CrystalAccessory[];
    },
    private readonly crystalProductService: CrystalProductService,
    private changeRef: ChangeDetectorRef,
  ) {
    this.accessoryTypeSubject
      .pipe(
        switchMap((type) =>
          this.crystalProductService.getCrystalAccessoriesByType(type),
        ),
      )
      .subscribe((data) => {
        const lessThanDiscount = [];
        const greaterThanDiscount = [];
        for (let [id, value] of Object.entries(data)) {
          const newItem = { ...value, id };

          if (value.price <= dialogData.discount) {
            lessThanDiscount.push(newItem);
          } else {
            greaterThanDiscount.push(newItem);
          }
        }
        this.lessThanDiscountAccessories = lessThanDiscount;
        this.greaterThanDiscountAccessories = greaterThanDiscount;
      });
  }

  ngOnInit(): void {
    this.selectedAccessories = this.dialogData.defaultAccessory;
    this.changeRef.detectChanges();
  }

  onSelect(type: CrystalAccessoryType) {
    this.accessoryTypeSubject.next(type);
  }

  onSelectAccessory(checked: boolean, data: CrystalAccessory) {
    this.selectedAccessories = checked
      ? this.selectedAccessories.concat(data)
      : this.selectedAccessories.filter((selected) => selected.id !== data.id);
    this.changeRef.detectChanges();
  }

  get accessoryTypeKeys() {
    return Object.values(CrystalAccessoryType) as CrystalAccessoryType[];
  }
}
