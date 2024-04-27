import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-dots',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="twMerge('overflow-hidden whitespace-nowrap', containerStyles)"
    >
      ............................................................................................................................................................................................................................................................................................................
    </div>
  `,
  styles: `
    :host {
      overflow: hidden;
      display: block;
      width: 100%;
    }
  `,
})
export class DotsComponent {
  @Input() containerStyles = '';

  twMerge = twMerge;
}
