import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [MatDividerModule, CommonModule],
  template: `
    <div [class]="containerClasses()">
      <div [class]="borderClasses()"></div>
      <div [class]="textClasses()">
        <ng-content></ng-content>
      </div>
      <div [class]="borderClasses()"></div>
    </div>
  `,
  styles: ``,
})
export class DividerComponent {
  borderStyles = input('border-[#0000001f]');
  containerStyles = input('text-gray-600');
  textStyles = input('');

  twMerge = twMerge;

  containerClasses = computed(() => {
    return twMerge(
      'relative flex mt-4 my-6 items-center justify-center',
      this.containerStyles(),
    );
  });

  borderClasses = computed(() => {
    return twMerge('border-t flex-1', this.borderStyles());
  });

  textClasses = computed(() => {
    return twMerge('bg-transparent font-bold flex-none', this.textStyles());
  });
}
