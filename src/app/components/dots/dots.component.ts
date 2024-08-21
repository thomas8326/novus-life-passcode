import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-dots',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
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
  containerStyles = input('');

  twMerge = twMerge;

  containerClasses = computed(() => {
    return twMerge('overflow-hidden whitespace-nowrap', this.containerStyles());
  });
}
