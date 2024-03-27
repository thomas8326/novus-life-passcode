import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-login-avatar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <div class="relative group p-3">
      <button class="flex items-center justify-center">
        <mat-icon class="text-white text-[30px] !w-full !h-full"
          >account_circle</mat-icon
        >
      </button>
      <div
        class="hidden group-hover:flex absolute flex-col bg-white p-2 z-50 text-black w-44 top-12 right-0 rounded shadow-sm"
      >
        <button class="py-2 hover:bg-gray-50" (click)="redirectMyProfile()">
          查看個人資料
        </button>
        <button class="py-2 hover:bg-gray-50" (click)="logout()">登出</button>
      </div>
    </div>
  `,
  styles: ``,
})
export class LoginAvatarComponent {
  constructor(
    private readonly router: Router,
    private readonly fireAuth: AngularFireAuth,
    private readonly accountService: AccountService,
  ) {}

  user = this.accountService.myAccount;

  redirectMyProfile() {
    this.router.navigate(['account']);
  }

  logout() {
    this.fireAuth.signOut();
  }
}
