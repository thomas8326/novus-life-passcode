import {
  Component,
  EventEmitter,
  Input,
  Output,
  effect,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-count-handler',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div [class]="twMerge('flex w-full h-full', containerStyles)">
      <button
        class="flex-1 border border-r-0 rounded-tl rounded-bl flex items-end justify-center border-highLight disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        [disabled]="quantity() <= 1"
        [style]="{ '--mat-icon-color': iconColor }"
      >
        <mat-icon class="w-[20px]! h-[20px]! text-[20px]" (click)="onMinus()"
          >remove</mat-icon
        >
      </button>
      <div
        class="flex-1 border flex items-center justify-center border-highLight"
      >
        {{ quantity() }}
      </div>
      <button
        class="flex-1 border border-l-0 rounded-tr rounded-br flex items-end justify-center border-highLight disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        (click)="onAdd()"
        [disabled]="quantity() >= maxCount"
        [style]="{ '--mat-icon-color': iconColor }"
      >
        <mat-icon class="w-[20px]! h-[20px]! text-[20px]">add</mat-icon>
      </button>
    </div>
  `,
  styles: ``,
})
export class CountHandlerComponent {
  @Input('quantity') set setQuantity(quantity: number) {
    this.quantity.set(quantity);
  }
  @Input() containerStyles = '';
  @Input() buttonStyles = '';
  @Input() maxCount = 99;
  @Output() quantityChange = new EventEmitter();
  @Input() iconColor = 'text-black';

  twMerge = twMerge;

  quantity = signal(1);

  private timeout: NodeJS.Timeout | null = null;

  constructor() {
    effect(() => {
      const quantity = this.quantity();

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.quantityChange.emit(quantity);
      }, 300);
    });
  }

  onMinus() {
    this.quantity.update((prev) => prev - 1);
  }
  onAdd() {
    this.quantity.update((prev) => prev + 1);
  }
}
