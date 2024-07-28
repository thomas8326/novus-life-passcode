import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { BankSelectorComponent } from 'src/app/components/bank-selector/bank-selector.component';
import { InstallmentTutorialComponent } from 'src/app/components/installment-tutorial/installment-tutorial.component';
import { StoreSelectorComponent } from 'src/app/components/store-selector/store-selector.component';
import { Remittance } from 'src/app/models/account';
import { Delivery } from 'src/app/models/delivery';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { UserBank } from 'src/app/services/bank/bank.service';
import {
  DEFAULT_PRICES,
  Prices,
} from 'src/app/services/updates/prices.service';
import { numericValidator } from 'src/app/validators/numberic.validators';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-remittance-information',
  standalone: true,
  imports: [
    BankSelectorComponent,
    MatTabsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    StoreSelectorComponent,
    MatStepperModule,
    MatIconModule,
    TwCurrencyPipe,
    InstallmentTutorialComponent,
  ],
  template: `
    <mat-stepper
      class="my-3"
      orientation="vertical"
      [linear]="true"
      [disableRipple]="true"
      #stepper
    >
      <mat-step>
        <ng-template matStepLabel>
          <h2 class="text-xl font-bold text-center text-gray-800">
            選擇付款方式
          </h2>
        </ng-template>
        <div class="py-6">
          <form [formGroup]="formGroup">
            <div class="space-y-4">
              <label
                class="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <input
                  type="radio"
                  formControlName="paymentType"
                  value="normal"
                  class="form-radio text-blue-600"
                />
                <span class="flex items-center space-x-3">
                  <mat-icon class="text-green-600">account_balance</mat-icon>
                  <span class="font-medium text-gray-700">正常匯款</span>
                </span>
              </label>
              <label
                class="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <input
                  type="radio"
                  formControlName="paymentType"
                  value="installment"
                  class="form-radio text-blue-600"
                />
                <span class="flex items-center space-x-3">
                  <mat-icon class="text-blue-600">credit_card</mat-icon>
                  <span class="font-medium text-gray-700">分期付款</span>
                </span>
              </label>
              @if (formGroup.get('paymentType')?.value === 'installment') {
                <app-installment-tutorial></app-installment-tutorial>
              }
            </div>
          </form>
        </div>
        <div class="flex justify-end">
          <div class="flex items-center gap-2">
            <button mat-button matStepperNext>下一步</button>
          </div>
        </div>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>
          <h2 class="text-xl font-bold text-center text-gray-800">
            輸入收件人資訊
          </h2>
        </ng-template>

        <form [formGroup]="formGroup" class="my-3 mb-2 lg:mb-4 lg:mx-0">
          <div class="flex items-center gap-2">
            <mat-form-field appearance="outline">
              <mat-label>收件人名稱:</mat-label>
              <input matInput formControlName="name" />
              @if (
                formGroup.get('name')?.hasError('required') &&
                (formGroup.get('name')?.touched || touched)
              ) {
                <mat-error> 收件人名稱為必填項 </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>收件人電話:</mat-label>
              <input matInput formControlName="phone" />
              @if (
                formGroup.get('phone')?.hasError('required') &&
                (formGroup.get('phone')?.touched || touched)
              ) {
                <mat-error> 收件人電話為必填項 </mat-error>
              }
            </mat-form-field>
          </div>

          <div class="flex flex-col">
            <app-bank-selector
              [touched]="touched"
              (bankChange)="patchBank($event)"
            ></app-bank-selector>
          </div>

          <div
            class="flex flex-col md:flex-row gap-2.5 items-start min-h-[255px]"
          >
            <div
              class="flex-1 w-full flex flex-col shadow-md border rounded-lg"
            >
              <label
                [class]="
                  twMerge(
                    'flex items-center justify-between p-4 rounded-lg bg-[#fafafa] cursor-pointer'
                  )
                "
              >
                <div class="flex items-center">
                  <input
                    type="radio"
                    name="delivery"
                    class="mr-3 hidden"
                    [checked]="delivery() === 'address'"
                    (change)="delivery.set('address')"
                  />
                  <div>
                    <div class="font-semibold">宅配到家</div>
                  </div>
                </div>
                <div class="font-semibold">
                  @if (isFreeTransportation) {
                    <span class="flex items-center">
                      <span class="line-through text-gray-400 mr-2">
                        {{ prices.deliveryToHome | twCurrency }}
                      </span>
                      <span class="text-green-600">
                        {{ 0 | twCurrency }}
                      </span>
                    </span>
                  } @else {
                    {{ prices.deliveryToHome | twCurrency }}
                  }
                </div>
              </label>

              @if (delivery() === 'address') {
                <div class="flex flex-col p-4" formGroupName="delivery">
                  <mat-form-field appearance="outline" class="!w-32">
                    <mat-label>郵遞區號</mat-label>
                    <input matInput formControlName="zipCode" />
                    @if (
                      formGroup.get('delivery.zipCode')?.hasError('required') &&
                      (formGroup.get('delivery.zipCode')?.touched || touched)
                    ) {
                      <mat-error> 郵遞區號為必填項 </mat-error>
                    }
                    @if (
                      formGroup.get('delivery.zipCode')?.hasError('numeric') &&
                      (formGroup.get('delivery.zipCode')?.touched || touched)
                    ) {
                      <mat-error> 郵遞區號必須為數字 </mat-error>
                    }
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>寄送地址</mat-label>
                    <textarea matInput formControlName="address"></textarea>
                    @if (
                      formGroup.get('delivery.address')?.hasError('required') &&
                      (formGroup.get('delivery.address')?.touched || touched)
                    ) {
                      <mat-error> 寄送地址為必填項 </mat-error>
                    }
                  </mat-form-field>
                </div>
              }
            </div>

            <div
              class="flex-1 w-full flex flex-col shadow-md border rounded-lg"
            >
              <label
                [class]="
                  twMerge(
                    'flex items-center justify-between p-4 rounded-lg bg-[#fafafa] cursor-pointer'
                  )
                "
              >
                <div class="flex items-center">
                  <input
                    type="radio"
                    name="delivery"
                    class="mr-3 hidden"
                    [checked]="delivery() === '711'"
                    (change)="delivery.set('711')"
                  />
                  <div>
                    <div class="font-semibold">7-ELEVEN</div>
                  </div>
                </div>
                <div class="font-semibold">
                  @if (isFreeTransportation) {
                    <span class="flex items-center">
                      <span class="line-through text-gray-400 mr-2">
                        {{ prices.deliveryToHome | twCurrency }}
                      </span>
                      <span class="text-green-600">
                        {{ 0 | twCurrency }}
                      </span>
                    </span>
                  } @else {
                    {{ prices.deliveryToHome | twCurrency }}
                  }
                </div>
              </label>

              @if (delivery() === '711') {
                <div class="flex flex-col p-4">
                  <app-store-selector
                    (deliveryChange)="patchDelivery($event)"
                    [touched]="touched"
                  ></app-store-selector>
                </div>
              }
            </div>
          </div>
          <div
            class=" text-gray-600 mt-2 italic w-full text-right text-mobileSmall md:text-desktopSmall"
          >
            @if (isFreeTransportation) {
              <span class="text-green-600"
                >已滿{{
                  prices.freeTransportation | twCurrency
                }}元，享受免運費優惠！</span
              >
            } @else {
              <span>
                滿{{
                  prices.freeTransportation | twCurrency
                }}元即可享受免運費優惠。<br />
                還差{{ prices.freeTransportation - totalAmount | twCurrency }}！
              </span>
            }
          </div>
        </form>
      </mat-step>
    </mat-stepper>
  `,
  styles: ``,
})
export class RemittanceInformationComponent implements OnInit {
  @Input() remittance: Remittance | null = null;
  @Input() touched = false;
  @Input() prices: Prices = DEFAULT_PRICES;
  @Input() totalAmount = 0;
  @Output() deliveryFeeChange = new EventEmitter<number>();

  twMerge = twMerge;
  delivery = signal<'address' | '711'>('address');
  isFreeTransportation = false;

  formGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    paymentType: ['normal', Validators.required],
    delivery: this.fb.group({
      zipCode: ['', numericValidator()],
      storeName: [''],
      address: ['', Validators.required],
    }),
    bank: this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      account: ['', [Validators.required, Validators.minLength(5)]],
    }),
  });

  constructor(private readonly fb: FormBuilder) {
    effect(() => {
      const delivery = this.delivery();
      const deliveryControl = this.formGroup.controls.delivery.controls;

      deliveryControl.zipCode.removeValidators(Validators.required);
      deliveryControl.storeName.removeValidators(Validators.required);

      if (delivery === 'address') {
        deliveryControl.zipCode.setValidators(Validators.required);
        this.formGroup.controls.delivery.patchValue({
          zipCode: this.remittance?.delivery.zipCode || '',
          address: this.remittance?.delivery.address || '',
          storeName: '',
        });
        this.deliveryFeeChange.emit(
          this.isFreeTransportation ? 0 : this.prices.deliveryToHome,
        );
      }
      if (delivery === '711') {
        deliveryControl.storeName.setValidators(Validators.required);
        this.formGroup.controls.delivery.patchValue({
          zipCode: '',
          storeName: '',
          address: '',
        });
        this.deliveryFeeChange.emit(
          this.isFreeTransportation ? 0 : this.prices.deliveryToStore,
        );
      }
    });
  }

  ngOnInit(): void {
    if (this.prices && this.totalAmount) {
      this.isFreeTransportation =
        this.totalAmount >= this.prices.freeTransportation;
    }

    if (this.remittance) {
      this.formGroup.patchValue(this.remittance);

      this.formGroup.valueChanges.subscribe((value) => {
        if (this.formGroup.invalid) {
          return;
        }

        console.log(this.formGroup.value);
      });
    }
  }

  patchDelivery(delivery: Delivery) {
    this.formGroup.patchValue({ delivery });
  }

  patchBank(bank: UserBank) {
    this.formGroup.patchValue({ bank });
  }
}
