import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

interface DialogData {
  title: string;
  message: string;
  confirmText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <div class="min-w-[300px] py-4">
      <h2 mat-dialog-title class="">{{ data.title }}</h2>
      <mat-dialog-content class="">
        <div>{{ data.message }}</div>
      </mat-dialog-content>
      <mat-dialog-actions [align]="'end'">
        <button mat-button [mat-dialog-close]="false">取消</button>
        <button mat-button class="bg-blue-400" [mat-dialog-close]="true">
          {{ data.confirmText ? data.confirmText : '確認' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: ``,
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
