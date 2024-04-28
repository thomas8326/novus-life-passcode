import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { RouteDataProps } from 'src/app/app-routing.module';
import { HamburgerComponent } from 'src/app/components/hamburger/hamburger.component';
import { RoutingComponent } from 'src/app/modules/client/routing/routing.component';
import { AccountService } from 'src/app/services/account/account.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
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
    RoutingComponent,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    FormsModule,
    HamburgerComponent,
  ],
})
export class ClientComponent {
  hasFooter = signal(false);
  userIsLogin$ = this.account.isLogin$;
  device$ = this.responsive.getDeviceObservable();

  opened = false;

  constructor(
    public readonly account: AccountService,
    public responsive: ResponsiveService,
  ) {}

  getRouterOutlet(route: ActivatedRoute) {
    const data = route.snapshot.data as RouteDataProps;

    if (route.snapshot && data) {
      this.hasFooter.set(data.hasFooter || false);
    }
  }
}
