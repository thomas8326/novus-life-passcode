import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
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
import { BankSelectorPanelComponent } from 'src/app/components/bank-selector/bank-selector-panel';
import {
  Bank,
  BankService,
  UserBank,
} from 'src/app/services/bank/bank.service';
import { FixedOverlayService } from 'src/app/services/fixed-overlay/fixed-overlay.service';
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
    BankSelectorPanelComponent,
  ],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        [class]="twMerge('relative cursor-pointer', containerTwStyles())"
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
      </div>

      <form
        [formGroup]="bankForm"
        [class]="twMerge('relative', containerTwStyles())"
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

    <ng-template #bankListTemplate>
      <app-bank-selector-panel
        [height]="'200px'"
        [bankList]="bankList()"
        [selectedBank]="selectedBank()"
        (selectedBankChange)="onSelectBank($event)"
        (close)="closeOverlay()"
      ></app-bank-selector-panel>
    </ng-template>
  `,
  styles: ``,
})
export class BankSelectorComponent implements OnInit {
  bankForm = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    account: [
      '',
      [Validators.required, Validators.minLength(5), numericValidator()],
    ],
  });

  containerTwStyles = input<string>('w-full');
  touched = input<boolean>(false);
  bank = input<Partial<UserBank>>({});

  bankChange = output<UserBank>();

  viewContainerRef = inject(ViewContainerRef);
  bankListTemplateRef = viewChild<TemplateRef<any>>('bankListTemplate');
  elemRef = viewChild<ElementRef>('clickable');

  twMerge = twMerge;

  bankList = signal<Bank[]>([]);

  displayBank = computed(() => {
    const bank = this.selectedBank();
    return isNotNil(bank) ? `${bank.code} - ${bank.name}` : '';
  });
  selectedBank = signal<Bank | null>(null);

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const clickedInsidePopup = this.elemRef()!.nativeElement.contains(
      event.target,
    );
    if (!clickedInsidePopup) {
      this.closeOverlay();
    }
  }

  constructor(
    private readonly bankService: BankService,
    private readonly fb: FormBuilder,
    private readonly fixedOverlayService: FixedOverlayService,
  ) {
    effect(() => {
      if (this.touched()) {
        this.bankForm.markAllAsTouched();
      }
    });

    this.bankList.set(this.bankService.fetchBankData());

    this.bankForm.valueChanges.subscribe((value) => {
      if (this.bankForm.valid) {
        const _value = value as UserBank;
        this.bankChange.emit(_value);
      }
    });
  }

  ngOnInit(): void {
    const bank = this.bank();
    if (bank) {
      this.bankForm.patchValue(bank);
    }
  }

  onClickInput() {
    this.bankForm.controls.code.markAsTouched();
    this.openOverlay();
  }

  onSelectBank(bank: Bank | null) {
    if (isNotNil(bank)) {
      this.selectedBank.set(bank);
      this.bankForm.patchValue(bank);
      this.closeOverlay();
    }
  }

  displayValue() {
    const bank = this.selectedBank();
    return isNotNil(bank) ? `${bank.code} - ${bank.name}` : '';
  }

  openOverlay() {
    this.fixedOverlayService.open(
      this.bankListTemplateRef()!,
      this.elemRef()!.nativeElement,
      this.viewContainerRef,
      { push: false, scrollable: false },
    );
  }

  closeOverlay() {
    this.fixedOverlayService.close();
  }
}
