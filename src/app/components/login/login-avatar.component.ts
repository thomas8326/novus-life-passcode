import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
import { twMerge } from 'tailwind-merge';
import { LoginButtonComponent } from './login-button.component';

@Component({
  selector: 'app-login-avatar',
  standalone: true,
  template: `
    <div [class]="twMerge('relative group p-3 w-full', containerStyles)">
      @if (userIsLogin$ | async) {
        <div class="flex flex-col lg:hidden">
          <ng-container *ngTemplateOutlet="routing"></ng-container>
        </div>
      }
      <div class="flex items-center justify-between w-full">
        @if (userIsLogin$ | async) {
          <button class="flex items-center gap-2">
            <mat-icon class="text-white text-[30px] !w-full !h-full"
              >account_circle</mat-icon
            >
            <div class="lg:hidden block">
              {{ account.getMyAccount()?.name }}
            </div>
          </button>
        } @else {
          <div>登入獲取完整服務！</div>
        }

        <div class="lg:hidden block">
          @if (userIsLogin$ | async) {
            <button
              class="rounded-md px-3 py-2 bg-highLight hover:bg-highLightHover font-bold"
              (click)="logout()"
            >
              登出
            </button>
          } @else {
            <app-login-button>
              <div
                class="rounded-md px-3 py-2 bg-highLight hover:bg-highLightHover font-bold"
              >
                登入
              </div>
            </app-login-button>
          }
        </div>
      </div>
      @if (userIsLogin$ | async) {
        <div
          class="hidden lg:group-hover:flex absolute flex-col bg-white p-2 z-50 text-black w-44 top-12 right-0 rounded shadow-sm"
        >
          <ng-container *ngTemplateOutlet="routing"></ng-container>
          <button class="py-2 hover:bg-gray-50 text-[18px]" (click)="logout()">
            登出
          </button>
        </div>
      }
    </div>

    <ng-template #routing>
      <a
        routerLink="account"
        class="relative flex items-center gap-3 w-full text-[18px] py-2 lg:hover:bg-gray-50"
        routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
      >
        <mat-icon>person</mat-icon>
        <span>查看個人資料</span>
      </a>
      <a
        routerLink="request-history"
        class="relative flex items-center gap-3 w-full text-[18px] py-2 lg:hover:bg-gray-50"
        routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
      >
        <mat-icon>history</mat-icon>
        <span>查看推算紀錄</span>
      </a>
    </ng-template>
  `,
  styles: ``,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    AsyncPipe,
    LoginButtonComponent,
  ],
})
export class LoginAvatarComponent {
  @Input() containerStyles = '';
  @Input() disabled = false;

  twMerge = twMerge;
  userIsLogin$ = this.account.loginState$.pipe(map((data) => data.loggedIn));

  constructor(
    private readonly router: Router,
    public readonly account: AccountService,
  ) {}

  redirectMyProfile() {
    this.router.navigate(['account']);
  }

  redirectRequestHistory() {
    this.router.navigate(['request-history']);
  }

  logout() {
    this.account.logout();
  }
}
