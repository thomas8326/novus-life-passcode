import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { BankSelectorComponent } from 'src/app/components/bank-selector/bank-selector.component';
import { InstallmentTutorialComponent } from 'src/app/components/installment-tutorial/installment-tutorial.component';
import { StoreSelectorComponent } from 'src/app/components/store-selector/store-selector.component';
import { UserInfoSelectorComponent } from 'src/app/components/user-info-selector/user-info-selector.component';
import { BasicInfo, Remittance } from 'src/app/models/account';
import { Delivery } from 'src/app/models/delivery';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { UserBank } from 'src/app/services/bank/bank.service';
import {
  DEFAULT_PRICES,
  Prices,
} from 'src/app/services/updates/prices.service';
import {
  numericValidator,
  taiwanPhoneValidator,
} from 'src/app/validators/numberic.validators';
import { twMerge } from 'tailwind-merge';
import { UserInfoFormComponent } from '../../modules/user-info-form/user-info-form.component';

@Component({
  selector: 'app-remittance-information',
  standalone: true,
  imports: [
    CommonModule,
    BankSelectorComponent,
    MatTabsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    StoreSelectorComponent,
    MatStepperModule,
    MatIconModule,
    TwCurrencyPipe,
    InstallmentTutorialComponent,
    UserInfoSelectorComponent,
    UserInfoFormComponent,
  ],
  template: `
    <form [formGroup]="formGroup" [class]="containerClass()">
      @if (!hidePaymentType()) {
        <h2 class="text-lg sm:text-xl font-semibold mb-4">訂單資訊</h2>

        <div class="mb-3">
          <mat-form-field appearance="outline">
            <mat-label>選擇付款方式</mat-label>
            <mat-select formControlName="paymentType">
              <mat-option value="normal">
                <mat-icon class="text-green-600">account_balance</mat-icon>
                <span class="font-medium text-gray-700">正常匯款</span>
              </mat-option>
              <mat-option value="installment">
                <mat-icon class="text-blue-600">credit_card</mat-icon>
                <span class="font-medium text-gray-700">分期付款</span>
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      }

      @if (formGroup.get('paymentType')?.value === 'installment') {
        <div class="mb-4">
          <h2 class="text-lg sm:text-xl font-semibold mb-4">申辦流程</h2>
          <app-installment-tutorial></app-installment-tutorial>
        </div>
      }

      @if (!hideTitle()) {
        <h2 class="text-lg sm:text-xl font-semibold mb-4">收件人</h2>
      }

      @if (!hideRecommend()) {
        <app-user-info-selector
          type="remittance"
          (userInfoChange)="onUserInfoChange($event)"
        >
        </app-user-info-selector>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <mat-form-field appearance="outline">
          <mat-label>姓名:</mat-label>
          <input matInput formControlName="name" />
          @if (
            formGroup.get('name')?.hasError('required') &&
            formGroup.get('name')?.touched
          ) {
            <mat-error> 姓名為必填項 </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>電話:</mat-label>
          <input matInput formControlName="phone" />

          <mat-error>
            @if (formGroup.get('phone')?.touched) {
              @if (formGroup.get('phone')?.hasError('required')) {
                電話為必填項
              } @else if (formGroup.get('phone')?.hasError('numeric')) {
                請輸入數字
              } @else if (formGroup.get('phone')?.hasError('invalidPhone')) {
                請輸入台灣電話
              }
            }
          </mat-error>
        </mat-form-field>
      </div>

      <div class="mb-3">
        <app-bank-selector
          [bank]="formGroup.controls.bank.value"
          [touched]="touched()"
          (bankFormChange)="onBankFormChange($event)"
        ></app-bank-selector>
      </div>
      @if (!hideDelivery()) {
        <h2 class="text-lg sm:text-xl font-semibold mb-4">運送資訊</h2>

        <div class="flex flex-col gap-2.5 items-start min-h-[255px]">
          <div class="flex-1 w-full flex flex-col shadow-md border rounded-lg">
            <label
              [class]="
                twMerge(
                  'flex items-center justify-between p-4 rounded-lg bg-[#9fb1c5] text-white cursor-pointer'
                )
              "
            >
              <div class="flex items-center">
                <input
                  type="radio"
                  name="delivery"
                  class="mr-3 hidden"
                  [checked]="delivery() === 'address'"
                  (change)="toggleDelivery('address')"
                />
                <div>
                  <div class="font-semibold">宅配到家</div>
                </div>
              </div>
              <div class="font-semibold">
                @if (isFreeTransportation()) {
                  <span class="flex items-center">
                    <span class="line-through text-white mr-2">
                      {{ prices().deliveryToHome | twCurrency }}
                    </span>
                    <span class="text-green-600">
                      {{ 0 | twCurrency }}
                    </span>
                  </span>
                } @else {
                  {{ prices().deliveryToHome | twCurrency }}
                }
              </div>
            </label>

            @if (delivery() === 'address') {
              <div class="flex flex-col p-4" formGroupName="delivery">
                <mat-form-field appearance="outline" class="!w-40">
                  <mat-label>郵遞區號</mat-label>
                  <input matInput formControlName="zipCode" />
                  @if (
                    formGroup.get('delivery.zipCode')?.hasError('required') &&
                    formGroup.get('delivery.zipCode')?.touched
                  ) {
                    <mat-error> 郵遞區號為必填項 </mat-error>
                  } @else if (
                    formGroup.get('delivery.zipCode')?.hasError('numeric') &&
                    formGroup.get('delivery.zipCode')?.touched
                  ) {
                    <mat-error> 郵遞區號必須為數字 </mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>寄送地址</mat-label>
                  <textarea matInput formControlName="address"></textarea>
                  @if (
                    formGroup.get('delivery.address')?.hasError('required') &&
                    formGroup.get('delivery.address')?.touched
                  ) {
                    <mat-error> 寄送地址為必填項 </mat-error>
                  }
                </mat-form-field>
              </div>
            }
          </div>

          <div class="flex-1 w-full flex flex-col shadow-md border rounded-lg">
            <label
              [class]="
                twMerge(
                  'flex items-center justify-between p-4 rounded-lg bg-[#9fb1c5] text-white cursor-pointer'
                )
              "
            >
              <div class="flex items-center">
                <input
                  type="radio"
                  name="delivery"
                  class="mr-3 hidden"
                  [checked]="delivery() === '711'"
                  (change)="toggleDelivery('711')"
                />
                <div>
                  <div class="font-semibold">7-ELEVEN</div>
                </div>
              </div>
              <div class="font-semibold">
                @if (isFreeTransportation()) {
                  <span class="flex items-center">
                    <span class="line-through text-white mr-2">
                      {{ prices().deliveryToStore | twCurrency }}
                    </span>
                    <span class="text-green-600">
                      {{ 0 | twCurrency }}
                    </span>
                  </span>
                } @else {
                  {{ prices().deliveryToStore | twCurrency }}
                }
              </div>
            </label>

            @if (delivery() === '711') {
              <div class="flex flex-col p-4">
                <app-store-selector
                  (deliveryChange)="patchDelivery($event)"
                  [touched]="touched()"
                ></app-store-selector>
              </div>
            }
          </div>
        </div>

        <div
          class="text-gray-600 mt-10 italic w-full text-right text-mobileSmall sm:text-desktopSmall"
        >
          @if (isFreeTransportation()) {
            <span class="text-green-600"
              >已滿{{
                prices().freeTransportation | twCurrency
              }}元，享受免運費優惠！</span
            >
          } @else {
            <span>
              滿{{
                prices().freeTransportation | twCurrency
              }}元即可享受免運費優惠。<br />
              還差{{
                prices().freeTransportation - totalAmount() | twCurrency
              }}！
            </span>
          }
        </div>
      }
    </form>
  `,
  styles: ``,
})
export class RemittanceInformationComponent {
  remittance = input<Remittance | null>(null);
  touched = input(false);
  prices = input<Prices>(DEFAULT_PRICES);
  totalAmount = input(0);
  styles = input<Partial<{ container: string }>>({ container: '' });
  hidePaymentType = input(false);
  hideDelivery = input(false);
  hideTitle = input(false);
  hideRecommend = input(false);

  bankForm = signal<{ data: UserBank | null; valid: boolean } | null>(null);

  deliveryFeeChange = output<number>();
  remittanceFormChange = output<{ data: Remittance | null; valid: boolean }>();

  delivery = signal<'address' | '711'>('address');
  isFreeTransportation = computed(
    () => this.totalAmount() >= this.prices().freeTransportation,
  );

  twMerge = twMerge;

  formGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
    phone: [
      '',
      [Validators.required, numericValidator(), taiwanPhoneValidator()],
    ],
    paymentType: ['normal', Validators.required],
    delivery: this.fb.nonNullable.group({
      zipCode: ['', [Validators.required, numericValidator()]],
      storeName: [''],
      address: ['', Validators.required],
    }),
    bank: this.fb.nonNullable.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      account: ['', [Validators.required, Validators.minLength(5)]],
    }),
  });

  containerClass = computed(() =>
    twMerge(
      'bg-white shadow-md rounded-lg p-4 sm:p-6',
      this.styles().container,
    ),
  );

  constructor(private readonly fb: FormBuilder) {
    effect(() => {
      if (this.touched()) {
        this.formGroup.markAllAsTouched();
      }
    });

    effect(() => {
      if (this.hideDelivery()) {
        this.formGroup.controls.delivery.disable();
      }
    });

    effect(() => {
      const remittance = this.remittance();
      if (remittance) {
        this.formGroup.patchValue(remittance, { emitEvent: false });
      }
    });

    this.formGroup.valueChanges.subscribe(() => {
      const remittance = {
        ...this.formGroup.getRawValue(),
        delivery: this.formGroup.controls.delivery.getRawValue(),
        bank: this.formGroup.controls.bank.getRawValue(),
        paymentType: this.formGroup.value.paymentType as
          | 'normal'
          | 'installment',
      };

      this.remittanceFormChange.emit({
        data: remittance,
        valid: this.formGroup.valid,
      });
    });
  }

  patchDelivery(delivery: Delivery) {
    this.formGroup.patchValue({ delivery });
  }

  toggleDelivery(delivery: 'address' | '711') {
    this.delivery.set(delivery);
    const deliveryControl = this.formGroup.controls.delivery.controls;

    deliveryControl.zipCode.removeValidators(Validators.required);
    deliveryControl.storeName.removeValidators(Validators.required);

    if (delivery === 'address') {
      deliveryControl.zipCode.setValidators(Validators.required);
      this.formGroup.controls.delivery.patchValue({
        zipCode: this.remittance()?.delivery.zipCode || '',
        address: this.remittance()?.delivery.address || '',
        storeName: '',
      });
      this.deliveryFeeChange.emit(
        this.isFreeTransportation() ? 0 : this.prices().deliveryToHome,
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
        this.isFreeTransportation() ? 0 : this.prices().deliveryToStore,
      );
    }
  }

  onBankFormChange(response: { data: UserBank | null; valid: boolean }) {
    this.formGroup.patchValue({ bank: response.data || {} });
  }

  onUserInfoChange(userInfo: Remittance | BasicInfo) {
    const remittance = userInfo as Remittance;
    this.formGroup.patchValue(remittance);
  }
}
