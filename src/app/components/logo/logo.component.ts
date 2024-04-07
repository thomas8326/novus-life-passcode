import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="text-[36px] font-bold flex gap-2" routerLink="home">
      <img
        src="assets/logo/novus-no-border.png"
        alt="Novus Crystal Life"
        class="w-[60px] h-[60px] border border-[#b5d7e2] rounded-full p-2 object-cover"
      />
      <div>Novus Crystal Life</div>
    </a>
  `,
  styles: ``,
})
export class LogoComponent {}
