import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartRemittanceState } from 'src/app/models/cart';

@Component({
  selector: 'app-remittance-state',
  standalone: true,
  imports: [],
  template: `
    <div class="flex gap-2 items-center">
      <div class="font-bold">匯款狀態</div>
      <div>-</div>
      <div>
        @switch (remittanceState) {
          @case (CartRemittanceState.None) {
            尚未匯款
          }
          @case (CartRemittanceState.Paid) {
            已匯款
          }
        }
      </div>
      <div>-</div>
      <button
        class="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-green-600"
        (click)="update.emit()"
        [disabled]="remittanceState !== CartRemittanceState.None"
      >
        我已匯款
      </button>
    </div>
  `,
  styles: ``,
})
export class RemittanceStateComponent {
  @Input() remittanceState: CartRemittanceState | null = null;
  @Output() update = new EventEmitter();

  CartRemittanceState = CartRemittanceState;
}
