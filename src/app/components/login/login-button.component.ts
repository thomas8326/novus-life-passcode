import { Component, EventEmitter, Output } from '@angular/core';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { LoginDialogComponent } from 'src/app/components/login/login-dialog.component';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [MatDialogModule, LoginDialogComponent],
  template: `<button (click)="openDialog()"><ng-content></ng-content></button>`,
  styles: ``,
})
export class LoginButtonComponent {
  @Output() afterLoggedIn = new EventEmitter<Function>();

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      restoreFocus: false,
    });
  }
}
