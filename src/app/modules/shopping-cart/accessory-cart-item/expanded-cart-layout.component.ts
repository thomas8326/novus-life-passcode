import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
  input,
  Output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expanded-cart-layout',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  template: `
    <div class="shadow rounded-md" [ngClass]="containerStyles()">
      <div class="w-full">
        <ng-content select="[display]"></ng-content>
      </div>
      <div
        class="overflow-hidden"
        [@expandCollapse]="showContent() ? 'expanded' : 'collapsed'"
      >
        <ng-content select="[content]"></ng-content>
      </div>
      <div class="w-full" (click)="toggleContent()">
        <ng-content select="[toggle]"></ng-content>
      </div>
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
  containerStyles = input('');

  @Output() showContentChange = new EventEmitter<boolean>();

  constructor() {
    effect(() => {
      this.showContentChange.emit(this.showContent());
    });
  }

  @Input() set initialShowContent(value: boolean) {
    this.showContent.set(value);
  }

  toggleContent() {
    this.showContent.update((prev) => !prev);
  }
}
