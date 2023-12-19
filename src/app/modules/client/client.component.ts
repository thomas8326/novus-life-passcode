import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LogoComponent } from '../../components/logo/logo.component';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    standalone: true,
    imports: [
        LogoComponent,
        RouterLink,
        RouterOutlet,
    ],
})
export class ClientComponent {
  constructor() {}
}
