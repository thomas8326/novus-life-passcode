import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
    <div class="px-4 py-6 rounded overflow-auto">
      <app-update-account
        [account]="{ uid: dialogData.uid, email: dialogData.email }"
        [hideBasicInfo]="true"
        [hideRemittance]="true"
        (afterUpdated)="dialogRef.close({ updated: true })"
      ></app-update-account>
    </div>
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;
    }
  `,
})
export class UpdateAccountDialogComponent {
  dialogRef = inject(MatDialogRef<UpdateAccountDialogComponent>);
  dialogData = inject<{ uid: string; email: string }>(MAT_DIALOG_DATA);
  response = inject(ResponsiveService);

  device = toSignal(this.response.getDeviceObservable());

  constructor() {
    effect(() => {
      const currentDevice = this.device();
      if (currentDevice) {
        if (currentDevice.desktop) {
          this.dialogRef.updateSize('410px', '630px');
        } else {
          this.dialogRef.updateSize('100%', 'auto');
        }
      }
    });
  }
}
