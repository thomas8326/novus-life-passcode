import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-expanding-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      id="toggleButton"
      [class]="twMerge('flex flex-col items-center w-full', containerStyle())"
    >
      <button
        class="transition duration-300 flex justify-between items-center w-full"
        (click)="onToggle()"
      >
        <div class="flex gap-2 items-center">
          @if (icon()) {
            <mat-icon [class]="iconStyles()">{{ icon() }}</mat-icon>
          }
          <span>{{ text() }}</span>
        </div>
        @if (open()) {
          <mat-icon>expand_less</mat-icon>
        } @else {
          <mat-icon>expand_more</mat-icon>
        }
      </button>
      <div
        [class]="
          twMerge(
            'rounded overflow-hidden transition-all duration-700 ease-in-out w-full pl-[15%]',
            optionStyles()
          )
        "
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
  text = input('');
  icon = input('');
  iconStyles = input('');
  containerStyle = input('');
  optionStyles = input('');

  twMerge = twMerge;

  open = signal(true);

  onToggle() {
    this.open.update((prev) => !prev);
  }
}
