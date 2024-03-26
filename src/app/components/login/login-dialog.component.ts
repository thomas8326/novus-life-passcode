import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  template: `<h2 mat-dialog-title class="text-center !my-8">歡迎回來</h2>
    <mat-dialog-content class="w-[400px] h-[500px]">
      <div class="flex flex-col gap-5 px-2">
        <input
          matInput
          cdkFocusInitial
          placeholder="輸入帳號"
          class="!outline-none rounded-full border border-[#c0c0c0] px-3 py-4"
        />

        <input
          matInput
          type="password"
          placeholder="輸入密碼"
          class="!outline-none rounded-full border border-[#c0c0c0] px-3 py-4"
        />

        <button
          class="rounded-full px-2.5 py-4 bg-highLight hover:bg-highLightHover text-white cursor-pointer shadow-lg"
        >
          登入
        </button>

        <div class="relative flex justify-center items-center text-[#8e8e8e]">
          <div class="border-b border-[#8e8e8e] my-4 w-full"></div>
          <div class="absolute bg-white px-2">使用社交帳號登入</div>
        </div>

        <button
          class="rounded-full px-2.5 py-4 bg-[#0866ff] hover:bg-[#065be6] text-white flex w-full items-center justify-center cursor-pointer shadow-lg gap-1.5"
          (click)="loginWithFB()"
        >
          <img
            src="assets/logo/Facebook_Logo_Primary.png"
            class="w-6 h-6 border rounded-full"
          />
          <span>使用 Facebook 登入</span>
        </button>
      </div>
    </mat-dialog-content>`,
  styles: ``,
})
export class LoginDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private readonly account: AccountService,
  ) {}

  loginWithFB() {
    this.account.loginWithFB().then(() => {
      this.dialogRef.close();
    });
  }
}
