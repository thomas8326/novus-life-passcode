import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import dayjs from 'dayjs';
import { InstallmentTutorialComponent } from 'src/app/components/installment-tutorial/installment-tutorial.component';
import {
  Remittance,
  RemittanceState,
  RemittanceStateType,
} from 'src/app/models/account';
import { Pay } from 'src/app/models/pay';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import {
  maxAmountValidator,
  numericValidator,
} from 'src/app/validators/numberic.validators';

@Component({
  selector: 'app-remittance-state',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    CommonModule,
    TwCurrencyPipe,
    InstallmentTutorialComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <div class="flex flex-col gap-2">
      <div class="font-bold">匯款狀態</div>
      @if (remittance()) {
        <div>
          匯款模式：{{
            remittance()!.paymentType === 'installment'
              ? '分期付款'
              : '正常匯款'
          }}
        </div>
        <div>
          匯款銀行: {{ remittance()!.bank.code }} -
          {{ remittance()!.bank.name }}
        </div>
        <div>匯款末五碼: {{ remittance()!.bank.account }}</div>
        <div>
          <div>匯款記錄(已匯款：{{ paidAmount() | twCurrency }}):</div>
          <div class="mx-4">
            @if (remittance()!.paymentType === 'installment') {
              分期付款申辦完成請主動通知我們。
            } @else {
              @for (remittanceState of remittanceStates(); track $index) {
                <div class="flex items-center gap-2">
                  <div>
                    匯款日期:
                    {{ remittanceState.paidDate | date: 'YYYY/MM/dd' }}
                  </div>
                  <div>金額: {{ remittanceState.paid | twCurrency }}</div>
                </div>
              } @empty {
                無匯款記錄
              }
            }
          </div>
        </div>
        @if (remittance()!.paymentType === 'installment') {
          <div>申辦流程:</div>
          <app-installment-tutorial></app-installment-tutorial>
        } @else {
          <div>
            <div>此次匯款金額(可以分次匯款):</div>
            @if (isSettle()) {
              <div class="font-bold mx-4">已全數匯款完畢</div>
            } @else {
              <form
                class="flex max-sm:flex-col sm:gap-2 mx-4 py-2"
                [formGroup]="formGroup"
              >
                <mat-form-field appearance="outline" class="w-full sm:!w-40">
                  <mat-label>匯款日期</mat-label>
                  <input
                    matInput
                    [matDatepicker]="picker"
                    formControlName="paidDate"
                  />
                  <mat-datepicker-toggle
                    matIconSuffix
                    [for]="picker"
                  ></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  @if (
                    formGroup.controls.paidDate.hasError('required') &&
                    formGroup.controls.paidDate.touched
                  ) {
                    <mat-error> 匯款日期為必填項 </mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full sm:!w-40">
                  <mat-label>匯款金額</mat-label>
                  <input
                    matInput
                    class="border border-gray-20 rounded-md w-40 px-1.5"
                    formControlName="money"
                  />
                  <mat-error>
                    @if (formGroup.controls.money.touched) {
                      @if (formGroup.controls.money.hasError('required')) {
                        匯款金額為必填項
                      } @else if (
                        formGroup.controls.money.hasError('numeric')
                      ) {
                        請輸入數字
                      } @else if (formGroup.controls.money.hasError('max')) {
                        匯款金額不能超過總金額
                      }
                    }
                  </mat-error>
                </mat-form-field>

                <button
                  type="button"
                  class="bg-green-600 h-[56px] text-white font-bold py-2 px-4 rounded hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-600"
                  (click)="onPaid()"
                >
                  匯款
                </button>
              </form>
            }
          </div>
        }
      }
      <div></div>
    </div>
  `,
  styles: ``,
})
export class RemittanceStateComponent {
  fb = inject(FormBuilder);

  remittance = input<Remittance | null>(null);
  remittanceStates = input<RemittanceState[]>([]);
  totalPrices = input(0);

  update = output<Pay>();

  moneyGreaterThanTotal = signal(false);

  paidAmount = computed(() => {
    return (this.remittanceStates() || []).reduce(
      (acc, curr) => acc + curr.paid,
      0,
    );
  });
  isSettle = computed(() => {
    const pays = this.paidAmount();
    return pays >= this.totalPrices();
  });

  formGroup = this.fb.nonNullable.group({
    paidDate: ['', [Validators.required]],
    money: ['', [Validators.required, numericValidator()]],
  });

  constructor() {
    effect(() => {
      const moneyControl = this.formGroup.get('money');
      const pays = this.paidAmount();
      if (moneyControl) {
        moneyControl.setValidators([
          Validators.required,
          Validators.min(0),
          maxAmountValidator(pays, this.totalPrices()),
        ]);
        moneyControl.updateValueAndValidity();
      }
    });
  }

  CartRemittanceState = RemittanceStateType;

  onPaid() {
    const { money, paidDate } = this.formGroup.value;
    const _money = Number(money);
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      this.update.emit({
        bank: this.remittance()!.bank,
        paid: _money,
        paidDate: dayjs(paidDate).toISOString(),
      });
      this.formGroup.patchValue({ money: '' });
      this.formGroup.markAsUntouched();
    }
  }
}
