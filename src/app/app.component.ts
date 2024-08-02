import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Unsubscribe } from 'firebase/auth';
import { ActivateEmailComponent } from 'src/app/components/activate-email/activate-email.component';
import { UpdateAccountDialogComponent } from 'src/app/components/update-account/update-account-dialog.component';
import { AccountService } from 'src/app/services/account/account.service';
import { LifePassportDescriptionService } from 'src/app/services/life-passport/life-passport-description.service';
import { NotifyService } from 'src/app/services/notify/notify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy, OnInit {
  private readonly allPassportDescription =
    this.lifePassportDescriptionService.listenAllPassportDescription();
  private readonly idCalculation =
    this.lifePassportDescriptionService.listenAllIdCalculations();
  private listener: {
    subscribe: () => Unsubscribe;
    unsubscribe: () => void;
  } = { subscribe: () => () => {}, unsubscribe: () => {} };

  constructor(
    private readonly lifePassportDescriptionService: LifePassportDescriptionService,
    private readonly notifyService: NotifyService,
    private readonly account: AccountService,
    private readonly dialog: MatDialog,
  ) {
    this.allPassportDescription.subscribe();
    this.idCalculation.subscribe();
  }

  ngOnInit(): void {
    this.account.loginState$.subscribe((state) => {
      if (state.loggedIn) {
        this.account.fetchMyAccount(state.uid).then((data) => {
          if (!data.name) {
            this.dialog
              .open(UpdateAccountDialogComponent, {
                data: {
                  uid: state.uid,
                  email: state.email,
                },
                disableClose: true,
              })
              .afterClosed()
              .pipe(takeUntilDestroyed())
              .subscribe((result: { updated: boolean }) => {
                if (result && result.updated) {
                  this.dialog.open(ActivateEmailComponent, {});
                }
              });
          }

          this.listener = data.isAdmin
            ? this.notifyService.listenAllNotify()
            : this.notifyService.listenNotify(state.uid);
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
