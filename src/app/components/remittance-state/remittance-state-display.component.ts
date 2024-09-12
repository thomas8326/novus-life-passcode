import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RemittanceState } from 'src/app/models/account';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-remittance-state-display',
  standalone: true,
  imports: [DatePipe, TwCurrencyPipe],
  template: `
    <div class="px-3 py-4">
      <div class="text-lg">總金額: {{ totalAmount() | twCurrency }}</div>
      <div class="text-lg">已匯款: {{ paidAmount() | twCurrency }}</div>
      <div
        class="text-lg border-b border-t border-gray-500 bg-gray-200 px-2 my-2"
      >
        客人付款狀態
      </div>
      <div class="py-2 mx-4 max-h-[300px] overflow-y-auto">
        @for (item of remittanceStates(); track $index) {
          <div class="flex items-center justify-between pr-8">
            <div class="flex flex-col item-center">
              <div>回報日期: {{ item.updatedAt | date: 'YYYY/MM/dd' }}</div>
              <div>付款日期: {{ item.paidDate | date: 'YYYY/MM/dd' }}</div>
              <div>
                銀行: {{ item.bank.code }} - {{ item.bank.name }} -
                {{ item.bank.account }}
              </div>
            </div>
            <div class="text-lg font-bold text-green-600">
              {{ item.paid | twCurrency }}
            </div>
          </div>
          <hr class="my-2" />
        } @empty {
          <div>暫無匯款</div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class RemittanceStateDisplayComponent {
  remittanceStates = input.required<NonNullable<RemittanceState[]>>();
  totalAmount = input.required<number>();
  paidAmount = computed(() => {
    return this.remittanceStates().reduce((acc, curr) => acc + curr.paid, 0);
  });

  sortedRemittanceStates = computed(() => {
    return [...this.remittanceStates()].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  });
}
