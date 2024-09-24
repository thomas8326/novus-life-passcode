import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { isNotNil } from 'src/app/common/utilities';
import { BankSelectorPanelComponent } from 'src/app/components/bank-selector/bank-selector-panel';
import { FormGroupControls } from 'src/app/models/form';
import {
  Bank,
  BankService,
  UserBank,
} from 'src/app/services/bank/bank.service';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-bank-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BankSelectorPanelComponent,
    MatMenuModule,
  ],
  template: `
    <form
      [formGroup]="bankFormGroup()"
      class="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      <div
        [class]="twMerge('relative cursor-pointer', containerTwStyles())"
        #clickable
      >
        <mat-form-field
          appearance="outline"
          class="relative w-full"
          [matMenuTriggerFor]="additionalMenu"
          #menuTrigger="matMenuTrigger"
        >
          <mat-label class="pointer-events-none">匯款銀行</mat-label>
          <div class="flex justify-between hover:border-highLight">
            <input
              matInput
              formControlName="code"
              [value]="displayBank()"
              readonly
              class="pointer-events-none"
            />
            <mat-icon class="text-highLight">keyboard_arrow_down</mat-icon>
          </div>
          @if (bankFormGroup().controls.code.hasError('required')) {
            <mat-error> 請輸入匯款銀行代碼 </mat-error>
          }
        </mat-form-field>
      </div>

      <mat-menu #additionalMenu="matMenu" [class]="'menu-bank-container'">
        <app-bank-selector-panel
          [height]="'200px'"
          [bankList]="bankList()"
          [selectedBank]="selectedBank()"
          (selectedBankChange)="onSelectBank($event)"
        ></app-bank-selector-panel>
      </mat-menu>

      <div [class]="twMerge('relative', containerTwStyles())">
        <mat-form-field class="flex flex-col w-full" appearance="outline">
          <mat-label>匯款末五碼</mat-label>
          <input matInput formControlName="account" maxlength="5" />
          @if (bankFormGroup().controls.account.touched) {
            <mat-error>
              @if (bankFormGroup().controls.account.hasError('required')) {
                請輸入匯款帳號末五碼
              } @else if (
                bankFormGroup().controls.account.hasError('minlength')
              ) {
                請輸入五碼
              } @else if (
                bankFormGroup().controls.account.hasError('numeric')
              ) {
                請輸入數字
              }
            </mat-error>
          }
        </mat-form-field>
      </div>
    </form>

    <ng-template #bankListTemplate> </ng-template>
  `,
  styles: ``,
})
export class NewBankSelectorComponent {
  bankFormGroup = input.required<FormGroup<FormGroupControls<UserBank>>>();

  containerTwStyles = input<string>('w-full');
  bank = input<Partial<UserBank>>({});

  viewContainerRef = inject(ViewContainerRef);
  bankListTemplateRef = viewChild<TemplateRef<any>>('bankListTemplate');
  elemRef = viewChild<ElementRef>('clickable');
  menuTrigger = viewChild<MatMenuTrigger>('menuTrigger');

  twMerge = twMerge;

  displayBank = computed(() => {
    const initBank = this.bank();
    const selectedBank = this.selectedBank();
    const bank = selectedBank ? selectedBank : initBank;

    return isNotNil(bank) && bank.code && bank.name
      ? `${bank.code} - ${bank.name}`
      : '';
  });

  selectedBank = signal<Bank | null>(null);
  bankList = signal<Bank[]>([]);

  constructor(private readonly bankService: BankService) {
    this.bankList.set(this.bankService.fetchBankData());
  }

  onSelectBank(bank: Bank | null) {
    if (isNotNil(bank)) {
      this.selectedBank.set(bank);
      this.bankFormGroup().controls.code.setValue(bank.code);
      this.bankFormGroup().controls.name.setValue(bank.name);
      this.menuTrigger()?.closeMenu();
    }
  }

  displayValue() {
    const bank = this.selectedBank();
    return isNotNil(bank) ? `${bank.code} - ${bank.name}` : '';
  }
}
