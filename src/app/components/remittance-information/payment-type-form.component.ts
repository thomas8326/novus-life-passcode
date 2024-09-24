import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { InstallmentTutorialComponent } from 'src/app/components/installment-tutorial/installment-tutorial.component';
import { PaymentType } from 'src/app/models/cart';

@Component({
  selector: 'app-payment-type-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    InstallmentTutorialComponent,
    ReactiveFormsModule,
  ],
  template: `
    @if (paymentTypeControl()) {
      <div>
        <h2 class="text-lg sm:text-xl font-semibold mb-4">訂單資訊</h2>

        <div class="mb-3">
          <mat-form-field appearance="outline">
            <mat-label>選擇付款方式</mat-label>
            <mat-select [formControl]="paymentTypeControl()">
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

        @if (paymentTypeControl().value === 'installment') {
          <div class="mb-4">
            <h2 class="text-lg sm:text-xl font-semibold mb-4">申辦流程</h2>
            <app-installment-tutorial></app-installment-tutorial>
          </div>
        }
      </div>
    }
  `,
  styles: ``,
})
export class PaymentTypeFormComponent {
  paymentTypeControl = input.required<FormControl<PaymentType>>();
}
