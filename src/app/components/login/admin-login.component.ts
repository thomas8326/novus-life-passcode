import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="flex flex-col w-full h-full items-center justify-center">
      <div class="flex justify-center relative">
        <div class="absolute -translate-y-[90%]">
          <img
            src="assets/logo/novus-logo.png"
            alt="Novus Crystal Life"
            class="w-[360px] aspect-square rounded-full p-2 object-cover"
          />
        </div>
        <div
          class="flex flex-col p-8 rounded-md shadow-md border relative w-[35vw] h-[30vh] translate-y-[10%]"
        >
          <div class="flex-1">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>帳號</mat-label>
              <input matInput [(ngModel)]="account" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>密碼</mat-label>
              <input matInput type="password" [(ngModel)]="password" />
            </mat-form-field>
          </div>
          <button
            mat-flat-button
            color="primary"
            class="!h-10"
            (click)="onLogin()"
          >
            登入
          </button>
        </div>
      </div>
      <div>
        @if (disabled()) {
          <mat-error>帳號已停用</mat-error>
        }
        @if (errorMessage()) {
          <div class="flex justify-center text-red-600">
            {{ errorMessage() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class AdminLoginComponent {
  account = signal('');
  password = signal('');
  disabled = signal(false);
  errorMessage = signal('');

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) {}

  onLogin() {
    this.accountService
      .loginAdmin(this.account(), this.password())
      .then((enabled) => {
        if (enabled) {
          this.router.navigate(['dashboard']);
        } else {
          this.accountService.logout();
          this.disabled.set(true);
        }
      })
      .catch(() => {
        this.errorMessage.set('帳號密碼錯誤，請重新嘗試');
      });
  }
}
