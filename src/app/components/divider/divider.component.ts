import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [MatDividerModule, CommonModule],
  template: `
    <div
      [class]="
        twMerge(
          'relative flex mt-4 my-6 items-center justify-center',
          containerStyles
        )
      "
      [ngClass]="containerStyles"
    >
      <mat-divider class="flex-1"></mat-divider>
      <div [class]="twMerge('absolute bg-white px-2 font-bold', textStyles)">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: ``,
})
export class DividerComponent {
  @Input() containerStyles: string = 'text-gray-600';
  @Input() textStyles: string = '';

  twMerge = twMerge;
}
