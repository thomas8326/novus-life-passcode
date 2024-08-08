import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { RouteDataProps } from 'src/app/app-routing.module';
import { ActivateEmailComponent } from 'src/app/components/activate-email/activate-email.component';
import { HamburgerComponent } from 'src/app/components/hamburger/hamburger.component';
import { LineUsComponent } from 'src/app/components/line-us/line-us.component';
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
    LineUsComponent,
  ],
})
export class ClientComponent {
  hasFooter = signal(false);
  noScrollbar = signal(false);

  userIsLogin$ = this.account.loginState$.pipe(map((data) => data.loggedIn));
  userNeedsToVerify$ = this.account.loginState$.pipe(
    map((data) => data.loggedIn && !data.user?.emailVerified),
  );
  device$ = this.responsive.getDeviceObservable();

  opened = false;

  constructor(
    public readonly account: AccountService,
    public responsive: ResponsiveService,
    private dialog: MatDialog,
  ) {}

  getRouterOutlet(route: ActivatedRoute) {
    const data = route.snapshot.data as RouteDataProps;

    if (route.snapshot && data) {
      this.hasFooter.set(data.hasFooter || false);
      this.noScrollbar.set(data.noScrollbar || false);
    }
  }

  openActiveEmail() {
    this.dialog.open(ActivateEmailComponent, {});
  }
}
