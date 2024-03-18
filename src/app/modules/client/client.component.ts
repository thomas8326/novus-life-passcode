import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { isNotNil } from 'ramda';
import { LoginButtonComponent } from 'src/app/components/login/login.component';
import { ConfigService } from 'src/app/services/account/account.service';
import { LogoComponent } from '../../components/logo/logo.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  standalone: true,
  imports: [
    LogoComponent,
    RouterLink,
    RouterOutlet,
    AsyncPipe,
    LoginButtonComponent,
    MatIconModule,
    MatButtonModule,
  ],
})
export class ClientComponent {
  pageTitle = signal('');

  userIsLogin = this.config.getLogin();

  constructor(public readonly config: ConfigService) {}

  getRouterOutlet(route: ActivatedRoute) {
    document.title = isNotNil(route.snapshot.title)
      ? `${route.snapshot.title} - Crystal Life`
      : 'Crystal Life';
    this.pageTitle.set(route.snapshot.data?.['title']);
  }
}
