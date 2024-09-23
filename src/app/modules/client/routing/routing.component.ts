import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginAvatarComponent } from 'src/app/components/login/login-avatar.component';
import { LoginButtonComponent } from 'src/app/components/login/login-button.component';
import { AuthService } from 'src/app/services/account/auth.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { LineUsComponent } from '../../../components/line-us/line-us.component';

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
    LineUsComponent,
  ],
  template: `
    @if (responsive.getDeviceObservable() | async; as device) {
      @if (device.desktop) {
        <div class="flex items-center text-[20px]">
          <a
            routerLink="home"
            class="mx-2"
            routerLinkActive="border-b border-white"
            >首頁</a
          >
          <hr class="w-[1px] h-[25px] bg-white rotate-45 mx-5" />
          <a
            routerLink="select-life-type"
            class="mx-2"
            routerLinkActive="border-b border-white"
            >款式選擇</a
          >
          <hr class="w-[1px] h-[25px] bg-white rotate-45 mx-5" />
          <a
            routerLink="shopping-cart"
            class="mx-2"
            routerLinkActive="border-b border-white"
            >購物車</a
          >
          <hr class="w-[1px] h-[25px] bg-white rotate-45 mx-5" />
          <a
            routerLink="faq"
            class="mx-2"
            routerLinkActive="border-b border-white"
            >FAQ</a
          >
          <app-line-us></app-line-us>
          <div class="order-1 sm:order-none">
            @if (userIsLogin()) {
              <app-login-avatar></app-login-avatar>
            } @else {
              <app-login-button>
                <div
                  class="rounded-md p-3 ml-2 bg-highLight hover:bg-highLightHover font-bold"
                >
                  登入
                </div>
              </app-login-button>
            }
          </div>
        </div>
      } @else {
        <div class="flex flex-col w-full h-screen bg-background gap-2 p-4">
          <div class="flex-1 text-mobileContent">
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
              routerLink="shopping-cart"
              class="relative flex items-center gap-3 w-full text-[18px] py-2"
              routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
            >
              <mat-icon>shopping_cart</mat-icon>
              <span>購物車</span>
            </a>
            <a
              routerLink="faq"
              class="relative flex items-center gap-3 w-full text-[18px] py-2"
              routerLinkActive="text-blue-400 after:content-[''] after:absolute after:right-0 after:w-[3px] after:h-3/4 after:bg-blue-600 after:rounded-tl-lg after:rounded-bl-lg"
            >
              <mat-icon>quiz</mat-icon>
              <span>FAQ</span>
            </a>
          </div>
          <div
            class="flex flex-col items-center flex-none border-t pt-4 border-gray-600"
          >
            <div class="w-full">
              <app-login-avatar containerStyles="p-1"></app-login-avatar>
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: ``,
})
export class RoutingComponent {
  public responsive = inject(ResponsiveService);
  private authService = inject(AuthService);

  userIsLogin = this.authService.isLogin;
}
