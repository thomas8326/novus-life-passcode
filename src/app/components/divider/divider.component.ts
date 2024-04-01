import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [MatDividerModule, CommonModule],
  template: `
    <div
      class="relative flex mt-2 my-6 items-center justify-center"
      [ngClass]="containerStyles"
    >
      <mat-divider class="flex-1"></mat-divider>
      <div class="absolute bg-white px-2 text-gray-600">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: ``,
})
export class DividerComponent {
  @Input() containerStyles: string = '';
}
