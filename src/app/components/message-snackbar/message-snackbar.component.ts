import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-message-snackbar',
  standalone: true,
  imports: [CommonModule, MatSnackBarLabel],
  template: `
    <div
      class="h-[40px] lg:h-[60px] flex items-center font-bold"
      [ngClass]="this.data.messageType"
      [style]="{ '--mdc-snackbar-supporting-text-size': '16px' }"
      matSnackBarLabel
    >
      {{ data.message }}
    </div>
  `,
})
export class MessageSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  data: {
    messageType: 'info' | 'error' | 'success';
    message: string;
  } = inject(MAT_SNACK_BAR_DATA);

  constructor() {
    if (this.data.messageType === 'info') {
      this.changeColor('yellow');
    } else if (this.data.messageType === 'error') {
      this.changeColor('red');
    } else {
      this.changeColor('green');
    }
  }

  changeColor(color: string) {
    document.documentElement.style.setProperty(
      '--mdc-snackbar-container-color',
      color,
    );
  }
}
