import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { RouteDataProps } from 'src/app/app-routing.module';
import { LoginAvatarComponent } from 'src/app/components/login/login-avatar.component';
import { LoginButtonComponent } from 'src/app/components/login/login-button.component';
import { AccountService } from 'src/app/services/account/account.service';
import { LogoComponent } from '../../components/logo/logo.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  standalone: true,
  imports: [
    CommonModule,
    LogoComponent,
    RouterLink,
    RouterOutlet,
    AsyncPipe,
    LoginButtonComponent,
    LoginAvatarComponent,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
})
export class ClientComponent {
  hasFooter = signal(false);

  userIsLogin$ = this.account.isLogin$;

  constructor(public readonly account: AccountService) {}

  getRouterOutlet(route: ActivatedRoute) {
    const data = route.snapshot.data as RouteDataProps;

    if (route.snapshot && data) {
      this.hasFooter.set(data.hasFooter || false);
    }
  }
}
