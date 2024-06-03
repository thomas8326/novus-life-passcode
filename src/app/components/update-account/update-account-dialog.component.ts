import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { numericValidator } from 'src/app/validators/numberic.validators';

@Component({
  selector: 'app-update-account-dialog',
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
        class="text-center !my-8 flex-none lg:text-desktopSubTitle text-mobileTitle font-bold"
      >
        輸入基本資料
      </h2>
      <div class="flex-1">
        <div class="flex flex-col w-full h-full">
          <div class="flex flex-col gap-1 px-2 flex-1">
            <mat-form-field appearance="outline">
              <mat-label>FB名稱/姓名</mat-label>
              <input matInput formControlName="name" />
              @if (this.form.controls.name.hasError('required')) {
                <mat-error>請入入FB名稱或姓名</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>聯絡電話</mat-label>
              <input matInput formControlName="phone" />
              @if (this.form.controls.phone.hasError('required')) {
                <mat-error>請輸入手機</mat-error>
              } @else if (this.form.controls.phone.hasError('numeric')) {
                <mat-error>請輸入數字</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex-none !w-32">
              <mat-label>郵遞區號</mat-label>
              <input matInput formControlName="zipCode" />
              @if (this.form.controls.zipCode.hasError('required')) {
                <mat-error>請輸入郵遞區號</mat-error>
              } @else if (this.form.controls.zipCode.hasError('numeric')) {
                <mat-error>請輸入數字</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>地址</mat-label>
              <input matInput formControlName="address" />
              @if (this.form.controls.address.hasError('required')) {
                <mat-error>請輸入地址</mat-error>
              }
            </mat-form-field>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <button
          mat-flat-button
          class="!bg-highLight !hover:bg-highLightHover !text-white !w-24 !h-12 !text-mobileSubTitle !lg:text-desktopSubTitle"
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
export class UpdateAccountDialogComponent implements OnInit {
  private account = signal<Partial<Account>>({});

  form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, numericValidator()]],
    email: ['', Validators.email],
    zipCode: ['', [Validators.required, numericValidator()]],
    address: ['', Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateAccountDialogComponent>,
    private fb: FormBuilder,
    private readonly accountService: AccountService,
    @Inject(MAT_DIALOG_DATA)
    private readonly dialogData: {
      uid?: string;
      email?: string;
    },
    private readonly response: ResponsiveService,
  ) {
    if (this.dialogData?.uid) {
      const { uid, email } = this.dialogData;
      this.account.update((prev) => ({ ...prev, uid, email }));
    }

    this.response.getDeviceObservable().subscribe((device) => {
      if (device.desktop) {
        this.dialogRef.updateSize('410px', '630px');
      } else {
        this.dialogRef.updateSize('100%', 'auto');
      }
    });
  }

  onUpdate() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const updatedAccount = {
      ...this.form.value,
      uid: this.account().uid,
    } as Account;

    this.accountService.updateUserAccount(updatedAccount).then(() => {
      const account = this.account();
      account.uid && this.accountService.fetchMyAccount(account.uid);
      this.dialogRef.close();
    });
  }

  ngOnInit(): void {
    if (this.account) {
      this.form.patchValue(this.account());
    }
  }
}
