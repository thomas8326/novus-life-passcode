import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expanding-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      id="toggleButton"
      class="flex flex-col items-center w-full"
      [ngClass]="containerStyle"
    >
      <button
        class="transition duration-300 flex justify-between items-center w-full"
        (click)="onToggle()"
      >
        <div class="flex gap-2 items-center">
          <mat-icon [class]="iconStyles">{{ icon }}</mat-icon>
          <span>{{ text }}</span>
        </div>
        @if (open()) {
          <mat-icon>expand_less</mat-icon>
        } @else {
          <mat-icon>expand_more</mat-icon>
        }
      </button>
      <div
        class="rounded overflow-hidden transition-all duration-700 ease-in-out w-full pl-[15%]"
        [@expandCollapse]="open() ? 'expanded' : 'collapsed'"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: ``,
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          margin: '0',
          overflow: 'hidden',
        }),
      ),
      state(
        'expanded',
        style({
          height: '*',
          margin: '4px 0',
          overflow: 'hidden',
        }),
      ),
      transition('expanded <=> collapsed', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ExpandingButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() iconStyles: string = '';
  @Input() containerStyle: string = '';

  open = signal(true);

  onToggle() {
    this.open.update((prev) => !prev);
  }
}
