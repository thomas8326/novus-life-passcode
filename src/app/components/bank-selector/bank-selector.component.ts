import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  computed,
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
import { isNotNil } from 'src/app/common/utilities';
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
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        [class]="twMerge('relative cursor-pointer', containerTwStyles)"
        #clickable
      >
        <div
          class="absolute inset-0 cursor-pointer z-10"
          (click)="onClickInput()"
        ></div>
        <form [formGroup]="bankForm">
          <mat-form-field appearance="outline" class="relative w-full">
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
            <mat-error>
              @if (bankForm.controls.code.hasError('required')) {
                請輸入匯款銀行代碼
              }
            </mat-error>
          </mat-form-field>
        </form>
        @if (openSelector()) {
          <div
            class="absolute w-full -translate-y-5 z-10 border border-highLight p-2 bg-white rounded-[8px]"
          >
            <input
              type="text"
              class="block w-full px-4 py-1 border border-highLight rounded-lg"
              placeholder="輸入銀行代碼"
              [(ngModel)]="searchQuery"
            />
            <div class="mt-2 w-full max-h-[280px] overflow-auto">
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
        }
      </div>

      <form
        [formGroup]="bankForm"
        [class]="twMerge('relative', containerTwStyles)"
      >
        <mat-form-field class="flex flex-col w-full" appearance="outline">
          <mat-label>匯款末五碼</mat-label>
          <input matInput formControlName="account" maxlength="5" />
          @if (bankForm.controls.account.touched) {
            <mat-error>
              @if (bankForm.controls.account.hasError('required')) {
                請輸入匯款帳號末五碼
              } @else if (bankForm.controls.account.hasError('minlength')) {
                請輸入五碼
              } @else if (bankForm.controls.account.hasError('numeric')) {
                請輸入數字
              }
            </mat-error>
          }
        </mat-form-field>
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

  @Input() containerTwStyles = 'w-full';
  @Input('touched') set setTouched(touched: boolean) {
    if (touched) {
      this.bankForm.markAllAsTouched();
    }
  }
  @Input() bank: UserBank | null = null;

  @Output() bankChange = new EventEmitter<UserBank>();

  twMerge = twMerge;

  bankList = signal<Bank[]>([]);
  searchQuery = signal('');
  filteredBanks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.bankList().filter(
      (bank) =>
        bank.code.toLowerCase().includes(query) ||
        bank.name.toLowerCase().includes(query),
    );
  });
  displayBank = computed(() => {
    const bank = this.selectedBank();
    return isNotNil(bank) ? `${bank.code} - ${bank.name}` : '';
  });
  selectedBank = signal<Bank | null>(null);
  openSelector = signal(false);
  @ViewChild('clickable') elemRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const clickedInsidePopup = this.elemRef.nativeElement.contains(
      event.target,
    );
    if (!clickedInsidePopup && this.openSelector()) {
      this.searchQuery.set('');
      this.openSelector.set(false);
    }
  }

  constructor(
    private readonly bankService: BankService,
    private readonly fb: FormBuilder,
  ) {
    this.bankList.set(this.bankService.fetchBankData());

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

  selectBank(bank: Bank) {
    this.selectedBank.set(bank);
    this.openSelector.set(false);
    this.bankForm.patchValue(bank);
  }

  displayValue() {
    const bank = this.selectedBank();
    return isNotNil(bank) ? `${bank.code} - ${bank.name}` : '';
  }
}
