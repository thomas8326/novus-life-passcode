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
          containerStyles,
          borderStyles
        )
      "
    >
      <div class="border-t flex-1 mr-2"></div>

      <div
        [class]="twMerge('bg-transparent px-2 font-bold flex-none', textStyles)"
      >
        <ng-content></ng-content>
      </div>
      <div class="border-t flex-1 ml-2"></div>
    </div>
  `,
  styles: ``,
})
export class DividerComponent {
  @Input() borderStyles = 'border-[#0000001f]';
  @Input() containerStyles: string = 'text-gray-600';
  @Input() textStyles: string = '';

  twMerge = twMerge;
}
