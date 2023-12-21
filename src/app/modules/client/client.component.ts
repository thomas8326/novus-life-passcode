import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { isNotNil } from 'ramda';
import { LogoComponent } from '../../components/logo/logo.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  standalone: true,
  imports: [LogoComponent, RouterLink, RouterOutlet, AsyncPipe],
})
export class ClientComponent {
  pageTitle = signal('');

  constructor(private route: ActivatedRoute) {}

  getRouterOutlet(route: ActivatedRoute) {
    document.title = isNotNil(route.snapshot.title)
      ? `${route.snapshot.title} - Crystal Life`
      : 'Crystal Life';
    this.pageTitle.set(route.snapshot.data?.['title']);
  }
}
