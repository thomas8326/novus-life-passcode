import { NgClass } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthError } from 'firebase/auth';
import { AccountService } from 'src/app/services/account/account.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  template: `
    <div class="overflow-hidden flex h-full">
      <div
        class="transition-transform duration-500 border flex-none flex flex-col w-full h-full relative"
        [class.-translate-x-full]="isRegister()"
      >
        <button mat-dialog-close class="!absolute top-0 right-0 p-2">
          <mat-icon>close</mat-icon>
        </button>
        <h2 mat-dialog-title class="text-center !my-2 sm:!my-8 flex-none">
          歡迎回來
        </h2>
        <mat-dialog-content class="flex-1 !px-[12px] sm:px-[24px]">
          <div class="flex flex-col w-full h-full">
            <div class="flex flex-col gap-2 sm:gap-5 px-2 flex-1">
              <input
                matInput
                cdkFocusInitial
                placeholder="輸入信箱"
                class="!outline-none rounded-full border border-[#c0c0c0] px-1.5 py-2 sm:px-3 sm:py-4"
                autocomplete="username"
                [(ngModel)]="email"
              />

              <input
                matInput
                type="password"
                placeholder="輸入密碼"
                class="!outline-none rounded-full border border-[#c0c0c0] px-1.5 py-2 sm:px-3 sm:py-4"
                autocomplete="current-password"
                [(ngModel)]="password"
              />

              <button
                class="rounded-full px-1.5 py-2 sm:px-3 sm:py-4 bg-highLight hover:bg-highLightHover text-white cursor-pointer shadow-lg"
                (click)="loginWithEmail()"
              >
                登入
              </button>

              @if (errorMessage()) {
                <div class="flex justify-center text-red-600">
                  {{ errorMessage() }}
                </div>
              }

              <div
                class="relative flex justify-center items-center text-[#8e8e8e] text-mobileSmall sm:text-desktopSmall"
              >
                <div class="border-b border-[#8e8e8e] my-4 w-full"></div>
                <div class="absolute bg-white px-2">使用社交帳號登入</div>
              </div>

              <button
                class="rounded-full px-1.5 py-2 sm:px-3 sm:py-4 bg-[#0866ff] hover:bg-[#065be6] text-white flex w-full items-center justify-center cursor-pointer shadow-lg gap-1.5"
                (click)="loginWithFB()"
              >
                <img
                  src="assets/logo/Facebook_Logo_Primary.png"
                  class="w-6 h-6 border rounded-full"
                />
                <span>使用 Facebook 登入</span>
              </button>
            </div>
            <div
              class="flex sm:flex-col items-center justify-center flex-none text-gray-400 text-mobileSmall sm:text-desktopSmall"
            >
              <div>沒有帳號？</div>
              <button (click)="isRegister.set(true)">註冊</button>
            </div>
          </div>
        </mat-dialog-content>
      </div>
      <div
        class="transition-transform duration-500 border w-full flex-none flex flex-col "
        [class.-translate-x-full]="isRegister()"
      >
        <h2 mat-dialog-title class="text-center !my-8 flex-none">註冊新帳號</h2>
        <mat-dialog-content class="w-full h-full flex-1">
          <form
            #myForm="ngForm"
            (ngSubmit)="signUpWithEmail(myForm)"
            class="flex flex-col w-full h-full"
          >
            <div class="flex flex-col gap-2 sm:gap-5 px-2 flex-1">
              <input
                matInput
                name="email"
                cdkFocusInitial
                placeholder="輸入電子信箱"
                class="!outline-none rounded-full border border-[#c0c0c0] px-1.5 py-2 sm:px-3 sm:py-4 w-full"
                autocomplete="username"
                [(ngModel)]="email"
                (ngModelChange)="resetErrorMessage()"
                email
              />

              <input
                matInput
                name="password"
                type="password"
                placeholder="輸入密碼"
                class="!outline-none rounded-full border border-[#c0c0c0] px-1.5 py-2 sm:px-3 sm:py-4 w-full"
                autocomplete="current-password"
                [(ngModel)]="password"
                (ngModelChange)="resetErrorMessage()"
              />

              <input
                matInput
                name="confirm-password"
                type="password"
                placeholder="再次輸入密碼"
                class="!outline-none rounded-full border border-[#c0c0c0] px-1.5 py-2 sm:px-3 sm:py-4 w-full"
                autocomplete="confirm-password"
                [(ngModel)]="confirmPassword"
                (ngModelChange)="resetErrorMessage()"
              />
              <div class="text-xs mt-2 mb-3 px-3 text-gray-500">
                <h4 class="font-semibold mb-2">密碼要求：</h4>
                <ul class="space-y-1">
                  <li
                    class="flex items-center"
                    [ngClass]="{
                      'text-gray-400': !password(),
                      'text-red-500': password() && !isLengthValid(),
                      'text-green-500': password() && isLengthValid(),
                    }"
                  >
                    <span class="mr-2">{{
                      password() && isLengthValid() ? '✓' : '•'
                    }}</span>
                    6至12個字符
                  </li>
                  <li
                    class="flex items-center"
                    [ngClass]="{
                      'text-gray-400': !password(),
                      'text-red-500': password() && !hasLetter(),
                      'text-green-500': password() && hasLetter(),
                    }"
                  >
                    <span class="mr-2">{{
                      password() && hasLetter() ? '✓' : '•'
                    }}</span>
                    至少包含一個英文字母
                  </li>
                  <li
                    class="flex items-center"
                    [ngClass]="{
                      'text-gray-400': !password(),
                      'text-red-500': password() && !hasNumber(),
                      'text-green-500': password() && hasNumber(),
                    }"
                  >
                    <span class="mr-2">{{
                      password() && hasNumber() ? '✓' : '•'
                    }}</span>
                    至少包含一個數字
                  </li>
                </ul>
              </div>

              <div class="flex flex-col gap-0.5">
                <button
                  class="rounded-full px-1.5 py-2 sm:px-3 sm:py-4 bg-highLight hover:bg-highLightHover text-white cursor-pointer shadow-lg"
                  type="submit"
                >
                  註冊
                </button>
                @if (errorMessage()) {
                  <div class="flex justify-center text-red-600 text-sm">
                    {{ errorMessage() }}
                  </div>
                }
              </div>
            </div>
            <div
              class="flex sm:flex-col items-center justify-center flex-none text-gray-400 text-mobileSmall sm:text-desktopSmall"
            >
              <div>已有帳號？</div>
              <button (click)="isRegister.set(false)">登入</button>
            </div>
          </form>
        </mat-dialog-content>
      </div>
    </div>
  `,
  styles: `
    ::ng-deep .cdk-global-overlay-wrapper {
      justify-content: center !important;
    }
  `,
})
export class LoginDialogComponent {
  email = signal('');
  password = signal('');
  confirmPassword = signal('');

  isRegister = signal(false);
  errorMessage = signal('');

  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  private accountService = inject(AccountService);
  private response = inject(ResponsiveService);

  device = toSignal(this.response.getDeviceObservable());

  isLengthValid() {
    const password = this.password();
    return password.length >= 6 && password.length <= 12;
  }

  hasLetter() {
    return /[a-zA-Z]/.test(this.password());
  }

  hasNumber() {
    return /\d/.test(this.password());
  }

  constructor() {
    effect(() => {
      const currentDevice = this.device();
      if (currentDevice) {
        if (currentDevice.desktop) {
          this.dialogRef.updateSize('410px', '630px');
        } else {
          this.dialogRef.updateSize('100%', 'auto');
        }
      }
    });
  }

  loginWithFB() {
    this.accountService.loginWithFB().then(() => {
      this.dialogRef.close();
    });
  }

  loginWithEmail() {
    this.accountService
      .loginWithEmail(this.email(), this.password())
      .then(() => {
        this.dialogRef.close();
      })
      .catch(() => {
        this.errorMessage.set('登入失敗，請檢查帳號密碼');
      });
  }

  signUpWithEmail(form: NgForm) {
    if (
      this.email() === '' ||
      this.password() === '' ||
      this.confirmPassword() === ''
    ) {
      this.errorMessage.set('請填寫所有必填欄位');
      return;
    }

    if (form.form.controls?.['email'].errors?.['email']) {
      this.errorMessage.set('信箱格式錯誤');
      return;
    }

    if (this.confirmPassword() !== this.password()) {
      this.errorMessage.set('密碼不一致');
      return;
    }

    if (!this.isLengthValid() || !this.hasLetter() || !this.hasNumber()) {
      return;
    }

    this.accountService
      .signUpWithEmail(this.email(), this.password())
      .then(() => this.dialogRef.close())
      .catch((error: AuthError) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.errorMessage.set('此信箱已被使用');
            break;
          case 'auth/invalid-email':
            this.errorMessage.set('信箱格式錯誤');
            break;
          default:
            this.errorMessage.set('註冊失敗，請聯絡我們的小幫手');
            break;
        }
      });
  }

  resetErrorMessage() {
    this.errorMessage.set('');
  }
}
