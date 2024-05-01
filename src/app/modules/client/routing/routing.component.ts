import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginAvatarComponent } from 'src/app/components/login/login-avatar.component';
import { LoginButtonComponent } from 'src/app/components/login/login-button.component';
import { AccountService } from 'src/app/services/account/account.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';

@Component({
  selector: 'app-routing',
  standalone: true,
  imports: [
    AsyncPipe,
    LoginButtonComponent,
    LoginAvatarComponent,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
  ],
  template: `
    @if (responsive.getDeviceObservable() | async; as device) {
      @if (device.desktop) {
        <div class="flex items-center">
          <a routerLink="home" class="mx-2">首頁</a>
          <hr class="w-[1px] h-[25px] bg-white rotate-45 mx-5" />
          <a routerLink="select-life-type" class="mx-2">款式選擇</a>
          <hr class="w-[1px] h-[25px] bg-white rotate-45 mx-5" />
          <a routerLink="user-info-form" class="mx-2">開始測量</a>
          <hr class="w-[1px] h-[25px] bg-white rotate-45 mx-5" />
          <a routerLink="shopping-cart" class="mx-2">購物車</a>
          <div class="order-1 lg:order-none">
            @if (userIsLogin$ | async) {
              <app-login-avatar></app-login-avatar>
            } @else {
              <app-login-button>
                <div
                  class="rounded-md p-3 ml-6 bg-highLight hover:bg-highLightHover font-bold"
                >
                  登入
                </div>
              </app-login-button>
            }
          </div>
        </div>
      } @else {
        <div class="flex flex-col w-full h-screen bg-background gap-2 p-4">
          <div class="flex-1">
            <div class="text-[20px] font-bold mb-4">Novus Crystal Life</div>
            <a
              routerLink="home"
              class="relative flex items-center gap-3 w-full text-[18px] py-2"
              routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
            >
              <mat-icon>home</mat-icon>
              <span>首頁</span>
            </a>
            <a
              routerLink="select-life-type"
              class="relative flex items-center gap-3 w-full text-[18px] py-2"
              routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
            >
              <mat-icon>category</mat-icon>
              <span>款式選擇</span>
            </a>
            <a
              routerLink="user-info-form"
              class="relative flex items-center gap-3 w-full text-[18px] py-2"
              routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
            >
              <mat-icon>analytics</mat-icon>
              <span>開始測量</span>
            </a>
            <a
              routerLink="shopping-cart"
              class="relative flex items-center gap-3 w-full text-[18px] py-2"
              routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
            >
              <mat-icon>shopping_cart</mat-icon>
              <span>購物車</span>
            </a>
          </div>
          <div
            class="flex flex-col items-center flex-none border-t py-4 border-gray-600"
          >
            <a
              routerLink="account"
              class="relative flex items-center gap-3 w-full text-[18px] py-2"
              routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
            >
              <mat-icon>person</mat-icon>
              <span>查看個人資料</span>
            </a>
            <a
              routerLink="request-history"
              class="relative flex items-center gap-3 w-full text-[18px] py-2"
              routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
            >
              <mat-icon>history</mat-icon>
              <span>查看推算紀錄</span>
            </a>

            <div class="flex justify-between items-center w-full mt-2">
              <div class="flex items-center gap-2">
                <app-login-avatar
                  [disabled]="true"
                  containerStyles="p-1"
                ></app-login-avatar>
                <div>{{ account.getMyAccount()?.name }}</div>
              </div>

              @if (userIsLogin$ | async) {
                <div
                  class="rounded-md px-3 py-2 bg-highLight hover:bg-highLightHover font-bold"
                >
                  登出
                </div>
              } @else {
                <app-login-button>
                  <div
                    class="rounded-md  ml-6 bg-highLight hover:bg-highLightHover font-bold"
                  >
                    登入
                  </div>
                </app-login-button>
              }
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: ``,
})
export class RoutingComponent {
  userIsLogin$ = this.account.isLogin$;

  opened = false;

  constructor(
    public readonly account: AccountService,
    public readonly responsive: ResponsiveService,
  ) {}
}