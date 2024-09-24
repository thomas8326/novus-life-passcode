import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankSelectorComponent } from 'src/app/components/bank-selector/bank-selector.component';
import { ConsigneeFormComponent } from 'src/app/components/remittance-information/consignee-form.component';
import { DeliveryFormComponent } from 'src/app/components/remittance-information/delivery-form.component';
import { PaymentTypeFormComponent } from 'src/app/components/remittance-information/payment-type-form.component';
import { UserInfoSelectorComponent } from 'src/app/components/user-info-selector/user-info-selector.component';
import { BasicInfo, Remittance } from 'src/app/models/account';
import { PaymentType } from 'src/app/models/cart';
import { Delivery } from 'src/app/models/delivery';
import { FormGroupControls } from 'src/app/models/form';
import {
  DEFAULT_PRICES,
  Prices,
} from 'src/app/services/updates/prices.service';
import {
  numericValidator,
  taiwanPhoneValidator,
} from 'src/app/validators/numberic.validators';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-remittance-information',
  standalone: true,
  imports: [
    CommonModule,
    BankSelectorComponent,
    ReactiveFormsModule,
    UserInfoSelectorComponent,
    PaymentTypeFormComponent,
    ConsigneeFormComponent,
    DeliveryFormComponent,
  ],
  template: `
    <form [formGroup]="formGroup" [class]="containerClass()">
      @if (!hidePaymentType()) {
        <app-payment-type-form
          [paymentTypeControl]="formGroup.controls.paymentType"
        ></app-payment-type-form>
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

      <app-consignee-form
        [nameControl]="formGroup.controls.name"
        [phoneControl]="formGroup.controls.phone"
        [bankFormGroup]="formGroup.controls.bank"
      ></app-consignee-form>

      @if (!hideDelivery()) {
        <app-delivery-form
          [isFreeTransportation]="isFreeTransportation()"
          [totalAmount]="totalAmount()"
          [prices]="prices()"
          [touched]="touched()"
          [deliveryForm]="formGroup.controls.delivery"
        ></app-delivery-form>
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

  deliveryFeeChange = output<number>();
  remittanceFormChange = output<{ data: Remittance | null; valid: boolean }>();

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
    paymentType: this.fb.nonNullable.control<PaymentType>(
      'normal',
      Validators.required,
    ),
    delivery: this.fb.nonNullable.group<FormGroupControls<Delivery>>({
      deliveryType: this.fb.nonNullable.control<'711' | 'address'>('address'),
      address: this.fb.nonNullable.control<string>(''),
      storeName: this.fb.nonNullable.control<string>(''),
      storeId: this.fb.nonNullable.control<string>(''),
      zipCode: this.fb.nonNullable.control<string>(''),
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
      const remittance = this.remittance();
      if (remittance) {
        this.formGroup.patchValue(remittance, { emitEvent: false });
      }
    });

    this.formGroup.valueChanges.subscribe(() => {
      const delivery = this.formGroup.controls.delivery.getRawValue();
      const bank = this.formGroup.controls.bank.getRawValue();
      const paymentType = this.formGroup.controls.paymentType.getRawValue();

      const remittance = {
        ...this.formGroup.getRawValue(),
        delivery,
        bank,
        paymentType,
      };

      this.deliveryFeeChange.emit(
        this.isFreeTransportation()
          ? 0
          : delivery.deliveryType === '711'
            ? this.prices().deliveryToStore
            : this.prices().deliveryToHome,
      );

      this.remittanceFormChange.emit({
        data: remittance,
        valid: this.formGroup.valid,
      });
    });
  }

  onUserInfoChange(userInfo: Remittance | BasicInfo) {
    const remittance = userInfo as Remittance;
    this.formGroup.patchValue(remittance);
  }
}
