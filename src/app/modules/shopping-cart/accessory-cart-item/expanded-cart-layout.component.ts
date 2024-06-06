import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expanded-cart-layout',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="shadow rounded-md">
      <div class="w-full bg-primary">
        <ng-content select="[display]"></ng-content>
      </div>
      <div
        class="overflow-hidden"
        [@expandCollapse]="showContent() ? 'expanded' : 'collapsed'"
      >
        <ng-content select="[content]"></ng-content>
      </div>
      <button
        class="w-full flex flex-col justify-center items-center bg-primary text-highLight cursor-pointer py-1 text-mobileSmall lg:text-desktopSmall"
        (click)="toggleContent()"
      >
        <div>{{ showContent() ? '隱藏明細' : '顯示明細' }}</div>
        <mat-icon class="!m-0">{{
          showContent()
            ? 'keyboard_double_arrow_up'
            : 'keyboard_double_arrow_down'
        }}</mat-icon>
      </button>
    </div>
  `,
  styles: ``,
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', [animate('600ms ease-in-out')]),
    ]),
  ],
})
export class ExpandedCartLayoutComponent {
  showContent = signal(false);

  toggleContent() {
    this.showContent.update((prev) => !prev);
  }
}
