import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  template: `<a class="text-[36px] font-bold" routerLink="home"
    >Novus Crystal Life</a
  >`,
  styles: ``,
})
export class LogoComponent {}
