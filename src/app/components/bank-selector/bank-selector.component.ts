import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  Bank,
  BankService,
  UserBank,
} from 'src/app/services/bank/bank.service';
import { numericValidator } from 'src/app/validators/numberic.validators';
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
  ],
  template: `
    <div class="flex flex-col lg:flex-row gap-2 lg:items-center py-4">
      <div [class]="twMerge('relative h-[42px]', containerTwStyles)">
        <div class="relative">
          <div
            class="flex justify-between p-2 border border-gray-400 rounded-lg cursor-pointer hover:border-highLight"
            (click)="onClickInput()"
          >
            @if (selectedBank()) {
              <span
                >{{ selectedBank()?.code }} - {{ selectedBank()?.name }}</span
              >
            } @else {
              <span>輸入銀行</span>
            }

            <mat-icon class="text-highLight">keyboard_arrow_down</mat-icon>
          </div>
          <div
            class="absolute text-mobileSmall lg:text-desktopSmall text-red-500 w-52 -bottom-5"
          >
            @if (
              bankForm.controls.code.invalid && bankForm.controls.code.touched
            ) {
              @if (bankForm.controls.code.hasError('required')) {
                <mat-error>請輸入匯款銀行代碼</mat-error>
              }
            }
          </div>
        </div>
        @if (openSelector()) {
          <div
            class="absolute w-full z-10 border border-highLight p-2 bg-white rounded-[8px]"
          >
            <input
              type="text"
              class="block w-full px-4 py-1 border border-highLight rounded-lg"
              placeholder="輸入銀行代碼"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterBanks()"
            />
            <div class="mt-2 w-full max-h-[280px] overflow-auto">
              <ul>
                @for (bank of filteredBanks; track $index) {
                  <li
                    class="px-1 py-3 hover:bg-highLight cursor-pointer tabular-nums"
                    (click)="selectBank(bank)"
                  >
                    {{ bank.code }} - {{ bank.name }}
                  </li>
                }
              </ul>
            </div>
          </div>
        }
      </div>

      <form
        [formGroup]="bankForm"
        [class]="twMerge('relative h-[42px]', containerTwStyles)"
      >
        <input
          matInput
          name="fiveDigits"
          formControlName="account"
          required
          minlength="5"
          maxlength="5"
          pattern="^[0-9]*$"
          class="w-full border border-gray-400 cursor-pointer hover:border-highLight rounded-md px-2 py-1 h-full bg-transparent placeholder:text-black"
          placeholder="匯款末五碼"
        />

        <div
          class="absolute text-mobileSmall lg:text-desktopSmall text-red-500 w-52 -bottom-5"
        >
          @if (
            bankForm.controls.account.invalid &&
            bankForm.controls.account.touched
          ) {
            @if (bankForm.controls.account.hasError('required')) {
              <mat-error>請輸入匯款帳號末五碼</mat-error>
            } @else if (this.bankForm.controls.account.hasError('minlength')) {
              <mat-error>請輸入五碼</mat-error>
            } @else if (this.bankForm.controls.account.hasError('numeric')) {
              <mat-error>請輸入數字</mat-error>
            }
          }
        </div>
      </form>
    </div>
  `,
  styles: ``,
})
export class BankSelectorComponent {
  bankForm = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    account: [
      '',
      [Validators.required, Validators.minLength(5), numericValidator()],
    ],
  });

  @Input() containerTwStyles = 'w-52';
  @Input('touched') set setTouched(touched: boolean) {
    if (touched) {
      this.bankForm.markAllAsTouched();
    }
  }
  @Input() bank: UserBank | null = null;

  @Output() bankChange = new EventEmitter<UserBank>();

  twMerge = twMerge;

  bankList: Bank[] = [];
  searchQuery: string = '';
  filteredBanks: Bank[] = [];
  selectedBank = signal<Bank | null>(null);
  openSelector = signal(false);

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const clickedInsidePopup = this.elemRef.nativeElement.contains(
      event.target,
    );
    if (!clickedInsidePopup && this.openSelector()) {
      this.openSelector.set(false);
    }
  }

  constructor(
    private readonly bankService: BankService,
    private readonly elemRef: ElementRef,
    private readonly fb: FormBuilder,
  ) {
    this.bankList = this.bankService.fetchBankData();
    this.filteredBanks = this.bankList;
    if (this.bank) {
      this.bankForm.patchValue(this.bank);
    }
    this.bankForm.valueChanges.subscribe((value) => {
      if (this.bankForm.valid) {
        const _value = value as UserBank;
        this.bankChange.emit(_value);
      }
    });
  }

  onClickInput() {
    this.bankForm.controls.code.markAsTouched();
    this.openSelector.update((prev) => !prev);
  }

  filterBanks() {
    const query = this.searchQuery.toLowerCase();
    this.filteredBanks = this.bankList.filter(
      (bank) =>
        bank.code.toLowerCase().includes(query) ||
        bank.name.toLowerCase().includes(query),
    );
  }

  selectBank(bank: Bank) {
    this.selectedBank.set(bank);
    this.openSelector.set(false);
    this.bankForm.patchValue(bank);
  }
}
