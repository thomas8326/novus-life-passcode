import { Component, effect, inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { Unsubscribe } from 'firebase/auth';
import { ActivateEmailComponent } from 'src/app/components/activate-email/activate-email.component';
import { UpdateAccountDialogComponent } from 'src/app/components/update-account/update-account-dialog.component';
import { AccountService } from 'src/app/services/account/account.service';
import { AuthService } from 'src/app/services/account/auth.service';
import { LifePassportDescriptionService } from 'src/app/services/life-passport/life-passport-description.service';
import { NotifyService } from 'src/app/services/notify/notify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnDestroy {
  private readonly lifePassportDescriptionService = inject(
    LifePassportDescriptionService,
  );
  private readonly notifyService = inject(NotifyService);
  private readonly account = inject(AccountService);
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  private readonly allPassportDescription =
    this.lifePassportDescriptionService.listenAllPassportDescription();
  private readonly idCalculation =
    this.lifePassportDescriptionService.listenAllIdCalculations();
  private listener: {
    subscribe: () => Unsubscribe;
    unsubscribe: () => void;
  } = { subscribe: () => () => {}, unsubscribe: () => {} };

  constructor() {
    this.allPassportDescription.subscribe();
    this.idCalculation.subscribe();

    effect(() => {
      const isLogin = this.auth.isLogin();
      const user = this.auth.user();

      console.log(user);
      console.log(isLogin);

      if (isLogin && user) {
        this.account.fetchMyAccount(user).then((data) => {
          if (!data.name) {
            this.dialog
              .open(UpdateAccountDialogComponent, {
                data: {
                  uid: user?.uid,
                  email: user?.email,
                },
                disableClose: true,
              })
              .afterClosed()
              .subscribe((result: { updated: boolean }) => {
                if (result && result.updated) {
                  this.dialog.open(ActivateEmailComponent, {});
                }
              });
          }

          this.listener = data.isAdmin
            ? this.notifyService.listenAllNotify()
            : this.notifyService.listenNotify(user?.uid);

          this.listener.subscribe();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.allPassportDescription.unsubscribe();
    this.idCalculation.unsubscribe();
    this.listener.unsubscribe();
  }
}
