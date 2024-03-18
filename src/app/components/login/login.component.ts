import { Component } from '@angular/core';
import { FacebookAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatDialogModule],
  template: `<button (click)="openDialog()"><ng-content></ng-content></button>`,
  styles: ``,
})
export class LoginButtonComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {});

    dialogRef.afterClosed().subscribe((result) => {});
  }
}

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './login-dialog.component.html',
  styles: ``,
})
class LoginDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private readonly fireAuth: AngularFireAuth,
  ) {}

  loginWithFB() {
    this.fireAuth.signInWithPopup(new FacebookAuthProvider());
  }
}
