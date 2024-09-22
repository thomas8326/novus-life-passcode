import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { AuthService } from 'src/app/services/account/auth.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { twMerge } from 'tailwind-merge';
import { LoginButtonComponent } from './login-button.component';

@Component({
  selector: 'app-login-avatar',
  standalone: true,
  template: `
    <div [class]="containerClass()">
      @if (userIsLogin()) {
        <div class="flex flex-col sm:hidden">
          <ng-container *ngTemplateOutlet="routing"></ng-container>
        </div>
      }
      <div class="flex items-center justify-between w-full">
        @if (userIsLogin()) {
          <button class="flex items-center gap-2">
            <div class="relative flex">
              <mat-icon class="text-white text-[30px] !w-full !h-full"
                >account_circle</mat-icon
              >
              @if (hasNotify()) {
                <div
                  class="hidden sm:flex w-3 h-3 bg-red-500 text-white rounded-full items-center justify-center absolute -top-0.5 -right-0.5 shadow"
                ></div>
              }
            </div>
            <div class="sm:hidden block">
              {{ userAccount()?.name }}
            </div>
          </button>
        } @else {
          <div>登入獲取完整服務！</div>
        }

        <div class="sm:hidden block">
          @if (userIsLogin()) {
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
      @if (userIsLogin()) {
        <div
          class="hidden sm:group-hover:flex absolute flex-col bg-white p-2 z-50 text-black w-44 top-12 right-0 rounded shadow-sm"
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
        class="relative flex items-center gap-3 w-full text-[18px] py-2 sm:hover:bg-gray-50"
        routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
      >
        <mat-icon>person</mat-icon>
        <span>查看個人資料</span>
      </a>
      <a
        routerLink="request-history"
        class="relative flex items-center gap-3 w-full text-[18px] py-2 sm:hover:bg-gray-50"
        routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
      >
        <mat-icon>history</mat-icon>
        <span>查看推算紀錄</span>
        @if (requestNotify().has) {
          <div
            class="w-6 h-6 sm:w-4 sm:h-4 bg-red-500 text-white rounded-full flex items-center justify-center sm:absolute top-0.5 right-0.5 shadow text-sm"
          >
            {{ requestNotify().count > 9 ? '9+' : requestNotify().count }}
          </div>
        }
      </a>
      <a
        routerLink="purchase-record"
        class="relative flex items-center gap-3 w-full text-[18px] py-2 sm:hover:bg-gray-50"
        routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
      >
        <mat-icon>receipt_long</mat-icon>
        <span>查看購買記錄</span>
        @if (cartNotify().has) {
          <div
            class="w-6 h-6 sm:w-4 sm:h-4 bg-red-500 text-white rounded-full flex items-center justify-center sm:absolute top-0.5 right-0.5 shadow text-sm"
          >
            {{ cartNotify().count > 9 ? '9+' : cartNotify().count }}
          </div>
        }
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
  containerStyles = input('');
  disabled = input(false);

  private router = inject(Router);
  private auth = inject(AuthService);
  private account = inject(AccountService);
  private notifyService = inject(NotifyService);

  userIsLogin = this.auth.isLogin;
  userAccount = this.account.myAccount;

  cartNotify = signal<{ has: boolean; count: number }>({
    has: false,
    count: 0,
  });
  requestNotify = signal<{ has: boolean; count: number }>({
    has: false,
    count: 0,
  });
  hasNotify = computed(() => this.cartNotify().has || this.requestNotify().has);

  containerClass = computed(() =>
    twMerge('relative group p-3 w-full', this.containerStyles()),
  );

  constructor() {
    this.notifyService.notify$.subscribe((notify) => {
      if (notify) {
        this.cartNotify.set({
          has: !notify.cartNotify.system.read,
          count: notify.cartNotify.system.count,
        });
        this.requestNotify.set({
          has: !notify.requestNotify.system.read,
          count: notify.requestNotify.system.count,
        });
      }
    });
  }

  redirectMyProfile() {
    this.router.navigate(['account']);
  }

  redirectRequestHistory() {
    this.router.navigate(['request-history']);
  }

  logout() {
    this.auth.logout();
  }
}
