import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { RouteDataProps } from 'src/app/app.routes';
import { ActivateEmailComponent } from 'src/app/components/activate-email/activate-email.component';
import { HamburgerComponent } from 'src/app/components/hamburger/hamburger.component';
import { LineUsComponent } from 'src/app/components/line-us/line-us.component';
import { RoutingComponent } from 'src/app/modules/client/routing/routing.component';
import { AccountService } from 'src/app/services/account/account.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { ScrollbarService } from 'src/app/services/scrollbar/scrollbar.service';
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
  opened = model(false);
  scrollbarContainer = viewChild<ElementRef>('scrollContainer');

  userIsLogin$ = this.account.loginState$.pipe(map((data) => data.loggedIn));
  userNeedsToVerify$ = this.account.loginState$.pipe(
    map((data) => data.loggedIn && !data.user?.emailVerified),
  );
  device$ = this.responsive.getDeviceObservable();

  constructor(
    public readonly account: AccountService,
    public responsive: ResponsiveService,
    private dialog: MatDialog,
    private scrollbarService: ScrollbarService,
  ) {
    effect(() => {
      if (this.scrollbarContainer()) {
        this.scrollbarService.setScrollContainer(
          this.scrollbarContainer()!.nativeElement,
        );
      }
    });
  }

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
