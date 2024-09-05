import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-extra-buy',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="extra-buy-container">
      <h3 class="text-lg font-bold mb-2">加購商品:</h3>
      <ul class="list-none p-0">
        @for (item of extraItems(); track item) {
          <li class="flex items-center mb-2">
            <mat-icon class="text-green-500 mr-2">check_circle</mat-icon>
            <span>{{ item }}</span>
          </li>
        } @empty {
          <li class="flex items-center ml-8 mb-2">無加購商品</li>
        }
      </ul>
    </div>
  `,
  styles: `
    .extra-buy-container {
      padding: 16px;
    }
  `,
})
export class ExtraBuyComponent {
  hasBox = input(false);

  extraItems = computed(() => {
    return this.hasBox() ? ['水晶寶盒'] : [];
  });
}
