import {
  Component,
  EventEmitter,
  Input,
  Output,
  effect,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-count-handler',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="flex w-full h-full">
      <button
        class="flex-1 border border-r-0 rounded-tl rounded-bl items-center justify-center "
      >
        <mat-icon
          class="w-[20px]! h-[20px]! text-[20px] mt-2.5"
          (click)="onMinus()"
          >remove</mat-icon
        >
      </button>
      <div class="flex-1 border flex items-center justify-center">
        {{ quantity() }}
      </div>
      <button
        class="flex-1 border border-l-0 rounded-tr rounded-br flex items-center justify-center"
        (click)="onAdd()"
      >
        <mat-icon class="w-[20px]! h-[20px]! text-[20px] mt-1">add</mat-icon>
      </button>
    </div>
  `,
  styles: ``,
})
export class CountHandlerComponent {
  @Input('quantity') set setQuantity(quantity: number) {
    this.quantity.set(quantity);
  }
  @Output() quantityChange = new EventEmitter();

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
      }, 600);
    });
  }

  onMinus() {
    this.quantity.update((prev) => prev - 1);
  }
  onAdd() {
    this.quantity.update((prev) => prev + 1);
  }
}
