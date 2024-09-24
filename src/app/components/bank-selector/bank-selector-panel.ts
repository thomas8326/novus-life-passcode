import { CommonModule } from '@angular/common';
import { Component, computed, input, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Bank } from 'src/app/services/bank/bank.service';

@Component({
  selector: 'app-bank-selector-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div
      class="w-full z-10 border border-highLight p-2 bg-white rounded-[8px] overflow-hidden flex flex-col"
      [style.height]="height()"
      (click)="$event.stopPropagation()"
    >
      <input
        type="text"
        class="block w-full px-4 py-1 border border-highLight rounded-lg flex-none"
        placeholder="輸入銀行代碼"
        [(ngModel)]="searchQuery"
      />
      <div class="my-2 w-full h-full overflow-auto flex-1">
        <ul>
          @for (bank of filteredBanks(); track bank.code) {
            <li
              class="px-1 py-3 hover:bg-highLight cursor-pointer tabular-nums"
              (click)="selectBank(bank)"
              [ngClass]="{
                'opacity-30 pointer-events-none':
                  selectedBank()?.code === bank.code,
              }"
            >
              {{ bank.code }} - {{ bank.name }}
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: ``,
})
export class BankSelectorPanelComponent {
  height = input('100%');
  bankList = input<Bank[]>([]);
  selectedBank = model<Bank | null>(null);

  searchQuery = signal('');
  filteredBanks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.bankList().filter(
      (bank) =>
        bank.code.toLowerCase().includes(query) ||
        bank.name.toLowerCase().includes(query),
    );
  });

  selectBank(bank: Bank) {
    this.selectedBank.set(bank);
  }
}
