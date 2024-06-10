import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UpdateAccountComponent } from 'src/app/components/update-account/update-account.component';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';

@Component({
  selector: 'app-update-account-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    UpdateAccountComponent,
  ],
  template: `
    <app-update-account
      [account]="{ uid: dialogData.uid, email: dialogData.email }"
      (afterUpdated)="dialogRef.close()"
    ></app-update-account>
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;
    }
  `,
})
export class UpdateAccountDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly dialogData: {
      uid: string;
      email: string;
    },
    private readonly response: ResponsiveService,
  ) {
    this.response.getDeviceObservable().subscribe((device) => {
      if (device.desktop) {
        this.dialogRef.updateSize('410px', '630px');
      } else {
        this.dialogRef.updateSize('100%', 'auto');
      }
    });
  }
}
