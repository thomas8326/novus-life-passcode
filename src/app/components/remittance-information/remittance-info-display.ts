import { Component, computed, input } from '@angular/core';
import { Consignee, Remittance } from 'src/app/models/account';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-remittance-info-display',
  standalone: true,
  imports: [],
  template: `
    <div [class]="twMerge('font-bold', styles()?.title)">收件人</div>
    <div [class]="twMerge('ml-4', styles()?.content)">
      <div class="flex gap-2">
        <div>姓名: {{ remittance().name }}</div>
        <div>手機: {{ remittance().phone }}</div>
      </div>
      <span
        >轉帳資訊: {{ remittance().bank.name }} ({{ remittance().bank.code }}) -
        {{ remittance().bank.account }}</span
      >
      @if (address()) {
        <div class="flex gap-2">地址：{{ address() }}</div>
      }
    </div>
  `,
  styles: ``,
})
export class RemittanceInfoDisplayComponent {
  styles = input<Partial<{ title: string; content: string }>>();
  remittance = input.required<NonNullable<Remittance | Consignee>>();
  twMerge = twMerge;

  address = computed(() => {
    const remittance = this.remittance() as Remittance;

    if (!remittance.delivery.zipCode && !remittance.delivery.address) {
      return '';
    }

    return `${remittance.delivery.zipCode} - ${remittance.delivery.address}`;
  });
}
