import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InstallmentTutorialComponent } from 'src/app/components/installment-tutorial/installment-tutorial.component';
import {
  Remittance,
  RemittanceState,
  RemittanceStateType,
} from 'src/app/models/account';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { UserBank } from 'src/app/services/bank/bank.service';

@Component({
  selector: 'app-remittance-state',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    CommonModule,
    TwCurrencyPipe,
    InstallmentTutorialComponent,
  ],
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
          <div>匯款記錄:</div>
          <div class="mx-4">
            @if (remittance()!.paymentType === 'installment') {
              分期付款申辦完成請主動通知我們。
            } @else {
              @for (remittanceState of remittanceStates(); track $index) {
                <div class="flex items-center gap-2">
                  <div>
                    日期: {{ remittanceState.updatedAt | date: 'YYYY/MM/dd' }}
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
              <div class="flex gap-2 mx-4 py-2">
                <input
                  class="border border-gray-20 rounded-md w-40 px-1.5"
                  [(ngModel)]="money"
                  type="number"
                />
                <button
                  class="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-600"
                  (click)="onPaid()"
                >
                  匯款
                </button>
              </div>
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
  remittance = input<Remittance | null>(null);
  remittanceStates = input<RemittanceState[]>([]);
  totalPrices = input(0);
  update = output<{ bank: UserBank; money: number }>();

  isSettle = computed(() => {
    const states = this.remittanceStates() || [];
    const pays = states.reduce((acc, curr) => acc + curr.paid, 0);
    return pays >= this.totalPrices();
  });

  money = 0;

  CartRemittanceState = RemittanceStateType;

  onPaid() {
    if (this.remittance() && this.money > 0) {
      this.update.emit({ bank: this.remittance()!.bank, money: this.money });
      this.money = 0;
    }
  }
}
