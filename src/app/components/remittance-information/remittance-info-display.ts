import { Component, computed, input } from '@angular/core';
import { Remittance } from 'src/app/models/account';

@Component({
  selector: 'app-remittance-info-display',
  standalone: true,
  imports: [],
  template: `
    <div class="font-bold">收件人</div>
    <div class="ml-4">
      <div class="flex gap-2">
        <div>姓名: {{ remittance().name }}</div>
        <div>手機: {{ remittance().phone }}</div>
      </div>
      <div>帳號末五碼: {{ remittance().bank.account }}</div>
      @if (address()) {
        <div class="flex gap-2">
          地址：{{ remittance().delivery.zipCode }} -
          {{ remittance().delivery.address }}
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class RemittanceInfoDisplayComponent {
  remittance = input.required<NonNullable<Remittance>>();

  address = computed(() => {
    if (
      !this.remittance().delivery.zipCode &&
      !this.remittance().delivery.address
    ) {
      return '';
    }

    return `${this.remittance().delivery.zipCode} - ${this.remittance().delivery.address}`;
  });
}
