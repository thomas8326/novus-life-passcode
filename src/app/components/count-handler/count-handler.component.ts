import { NgClass } from '@angular/common';
import { Component, computed, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-count-handler',
  standalone: true,
  imports: [MatIconModule, NgClass],
  template: `
    <div [class]="containerClass()">
      <button
        [ngClass]="minusButtonClass()"
        [disabled]="quantity() <= 1"
        [style]="{ '--mat-icon-color': iconColor() }"
        (click)="onMinus()"
      >
        <mat-icon class="w-[20px]! h-[20px]! text-[20px]">remove</mat-icon>
      </button>
      <div
        class="flex-1 border flex items-center justify-center border-highLight"
      >
        {{ quantity() }}
      </div>
      <button
        [ngClass]="addButtonClass()"
        (click)="onAdd()"
        [disabled]="quantity() >= maxCount()"
        [style]="{ '--mat-icon-color': iconColor() }"
      >
        <mat-icon class="w-[20px]! h-[20px]! text-[20px]">add</mat-icon>
      </button>
    </div>
  `,
  styles: ``,
})
export class CountHandlerComponent {
  quantity = model(1);

  containerStyles = input('');
  buttonStyles = input('');
  maxCount = input(99);
  iconColor = input('text-black');

  containerClass = computed(() =>
    twMerge('flex w-full h-full', this.containerStyles()),
  );

  minusButtonClass = computed(() =>
    twMerge(
      'flex-1 border border-r-0 rounded-tl rounded-bl flex items-end justify-center border-highLight disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      this.buttonStyles(),
    ),
  );

  addButtonClass = computed(() =>
    twMerge(
      'flex-1 border border-l-0 rounded-tr rounded-br flex items-end justify-center border-highLight disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      this.buttonStyles(),
    ),
  );

  onMinus() {
    this.quantity.update((prev) => Math.max(1, prev - 1));
  }

  onAdd() {
    this.quantity.update((prev) => Math.min(this.maxCount(), prev + 1));
  }
}
