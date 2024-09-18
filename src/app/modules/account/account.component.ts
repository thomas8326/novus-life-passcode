import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MessageSnackbarComponent } from 'src/app/components/message-snackbar/message-snackbar.component';
import { UpdateAccountComponent } from 'src/app/components/update-account/update-account.component';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    UpdateAccountComponent,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './account.component.html',
  styles: ``,
})
export class AccountComponent {
  private readonly account = inject(AccountService);
  private readonly snackBar = inject(MatSnackBar);
  myAccount = toSignal(this.account.myAccount$);

  onUpdated() {
    this.snackBar.openFromComponent(MessageSnackbarComponent, {
      data: {
        message: '已成功更新',
        messageType: 'success',
      },
      horizontalPosition: 'end',
      duration: 600,
    });
  }
}
