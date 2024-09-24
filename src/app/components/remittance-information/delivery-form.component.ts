import { Component, input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InstallmentTutorialComponent } from 'src/app/components/installment-tutorial/installment-tutorial.component';
import { StoreSelectorComponent } from 'src/app/components/store-selector/store-selector.component';

import { Delivery } from 'src/app/models/delivery';
import { FormGroupControls } from 'src/app/models/form';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import {
  DEFAULT_PRICES,
  Prices,
} from 'src/app/services/updates/prices.service';
import { numericValidator } from 'src/app/validators/numberic.validators';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-delivery-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    InstallmentTutorialComponent,
    ReactiveFormsModule,
    TwCurrencyPipe,
    StoreSelectorComponent,
  ],
  template: `
    <form [formGroup]="deliveryForm()">
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
                name="deliveryType"
                class="mr-3 hidden"
                formControlName="deliveryType"
                (ngModelChange)="toggleDelivery('address')"
                value="address"
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

          @if (deliveryForm().get('deliveryType')?.value === 'address') {
            <div class="flex flex-col p-4">
              <mat-form-field appearance="outline" class="!w-40">
                <mat-label>郵遞區號</mat-label>
                <input matInput formControlName="zipCode" />
                @if (
                  deliveryForm().controls.zipCode.hasError('required') &&
                  deliveryForm().controls.zipCode.touched
                ) {
                  <mat-error> 郵遞區號為必填項 </mat-error>
                } @else if (
                  deliveryForm().controls.zipCode.hasError('numeric') &&
                  deliveryForm().controls.zipCode.touched
                ) {
                  <mat-error> 郵遞區號必須為數字 </mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>寄送地址</mat-label>
                <textarea matInput formControlName="address"></textarea>
                @if (
                  deliveryForm().controls.address.hasError('required') &&
                  deliveryForm().controls.address.touched
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
                name="deliveryType"
                class="mr-3 hidden"
                formControlName="deliveryType"
                (ngModelChange)="toggleDelivery('711')"
                value="711"
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

          @if (deliveryForm().get('deliveryType')?.value === '711') {
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
            還差{{ prices().freeTransportation - totalAmount() | twCurrency }}！
          </span>
        }
      </div>
    </form>
  `,
  styles: ``,
})
export class DeliveryFormComponent implements OnInit {
  deliveryForm = input.required<FormGroup<FormGroupControls<Delivery>>>();
  isFreeTransportation = input(false);
  totalAmount = input(0);
  prices = input<Prices>(DEFAULT_PRICES);
  touched = input(false);

  twMerge = twMerge;

  ngOnInit(): void {
    const type: 'address' | '711' =
      this.deliveryForm().get('deliveryType')?.value || 'address';
    this.toggleDelivery(type);
  }

  toggleDelivery(delivery: 'address' | '711') {
    if (delivery === '711') {
      this.deliveryForm()
        .get('storeName')
        ?.setValidators([Validators.required]);
      this.deliveryForm().get('storeId')?.setValidators([Validators.required]);
      this.deliveryForm().get('zipCode')?.clearValidators();
    } else if (delivery === 'address') {
      this.deliveryForm().get('storeName')?.clearValidators();
      this.deliveryForm().get('storeId')?.clearValidators();
      this.deliveryForm()
        .get('zipCode')
        ?.setValidators([Validators.required, numericValidator]);
    }
    this.deliveryForm().get('address')?.setValidators([Validators.required]);

    this.deliveryForm().get('address')?.updateValueAndValidity();
    this.deliveryForm().get('storeName')?.updateValueAndValidity();
    this.deliveryForm().get('storeId')?.updateValueAndValidity();
    this.deliveryForm().get('zipCode')?.updateValueAndValidity();
  }

  patchDelivery(delivery: Partial<Delivery>) {
    this.deliveryForm().patchValue(delivery);
  }
}
