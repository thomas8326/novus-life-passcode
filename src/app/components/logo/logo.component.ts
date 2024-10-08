import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a
      class="text-[20px] sm:text-[36px] font-bold flex gap-2 items-center"
      routerLink="home"
    >
      <img
        src="assets/logo/novus-logo.png"
        alt="Novus Crystal Life"
        class="w-[40px] sm:w-[60px] aspect-square border border-[#b5d7e2] rounded-full p-1 sm:p-2 object-cover"
      />
      <div lang="en">Novus Crystal Life</div>
    </a>
  `,
  styles: ``,
})
export class LogoComponent {}
