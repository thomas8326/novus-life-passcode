import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

    this.account.isLogin$.subscribe((isLogin) => {
      if (!isLogin) {
        this.dialog.open(LoginDialogComponent, {});

        return;
      }

      this.afterLoginClick.emit();
    });
  }
}
