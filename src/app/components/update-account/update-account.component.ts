import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';
import {
  numericValidator,
  taiwanPhoneValidator,
} from 'src/app/validators/numberic.validators';

@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  template: `
    <form
      [formGroup]="form"
      class="flex flex-col w-full h-full px-2 py-4 overflow-hidden"
    >
      <h2
        class="text-center !my-8 flex-none sm:text-desktopSubTitle text-mobileTitle font-bold"
      >
        輸入基本資料
      </h2>
      <div class="flex-1">
        <div class="flex flex-col w-full h-full">
          <div class="flex flex-col gap-1 px-2 flex-1">
            <mat-form-field appearance="outline">
              <mat-label>FB名稱/姓名</mat-label>
              <input matInput formControlName="name" />
              @if (form.controls.name.hasError('required')) {
                <mat-error>請入入FB名稱或姓名</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>聯絡電話</mat-label>
              <input matInput formControlName="phone" />
              @if (form.controls.phone.hasError('required')) {
                <mat-error>請輸入手機</mat-error>
              } @else if (form.controls.phone.hasError('numeric')) {
                <mat-error>請輸入數字</mat-error>
              } @else if (form.controls.phone.hasError('invalidPhone')) {
                <mat-error>請輸入台灣電話</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex-none !w-32">
              <mat-label>郵遞區號</mat-label>
              <input matInput formControlName="zipCode" />
              @if (form.controls.zipCode.hasError('required')) {
                <mat-error>請輸入郵遞區號</mat-error>
              } @else if (form.controls.zipCode.hasError('numeric')) {
                <mat-error>請輸入數字</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>地址</mat-label>
              <input matInput formControlName="address" />
              @if (form.controls.address.hasError('required')) {
                <mat-error>請輸入地址</mat-error>
              }
            </mat-form-field>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <button
          mat-flat-button
          class="!bg-highLight !hover:bg-highLightHover !text-white !w-24 !h-12 !text-mobileSubTitle !sm:text-desktopSubTitle"
          (click)="onUpdate()"
        >
          更新
        </button>
      </div>
    </form>
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;
    }
  `,
})
export class UpdateAccountComponent implements OnInit {
  account = input<Partial<Account>>({});
  afterUpdated = output<void>();

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  form = this.fb.group({
    name: ['', Validators.required],
    phone: [
      '',
      [Validators.required, numericValidator(), taiwanPhoneValidator()],
    ],
    email: ['', Validators.email],
    zipCode: ['', [Validators.required, numericValidator()]],
    address: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.account) {
      this.form.patchValue(this.account());
    }
  }

  onUpdate() {
    this.form.markAllAsTouched();
    const uid = this.account().uid;

    if (this.form.invalid || !uid) {
      return;
    }

    const account: Account = {
      uid,
      name: this.form.value.name ?? '',
      phone: this.form.value.phone ?? '',
      email: this.form.value.email ?? '',
      zipCode: this.form.value.zipCode ?? '',
      address: this.form.value.address ?? '',
      enabled: true,
      isActivated: false,
      isAdmin: false,
      calculationRequests: [],
      cartRecords: [],
    };

    this.accountService.setUserAccount(uid, account).then(() => {
      this.accountService.fetchMyAccount(
        this.accountService.getFireAuthCurrentUser(),
      );
      this.afterUpdated.emit();
    });
  }
}
