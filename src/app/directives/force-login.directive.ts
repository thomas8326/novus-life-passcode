import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivateEmailComponent } from 'src/app/components/activate-email/activate-email.component';
import { LoginDialogComponent } from 'src/app/components/login/login-dialog.component';
import { AccountService } from 'src/app/services/account/account.service';

@Directive({
  selector: '[appForceLogin]',
  standalone: true,
})
export class ForceLoginDirective {
  constructor(
    private account: AccountService,
    private dialog: MatDialog,
  ) {}

  @Output() afterLoginClick = new EventEmitter();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopImmediatePropagation();

    this.account.loginState$.subscribe((state) => {
      if (!state.loggedIn) {
        this.dialog.open(LoginDialogComponent, {});

        return;
      }

      if (!state.user?.emailVerified) {
        this.dialog.open(ActivateEmailComponent, {});

        return;
      }

      this.afterLoginClick.emit();
    });
  }
}
