import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateAccountDialogComponent } from 'src/app/components/update-account/update-account-dialog.component';
import { AccountService } from 'src/app/services/account/account.service';
import { LifePassportDescriptionService } from 'src/app/services/life-passport/life-passport-description.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy, OnInit {
  private readonly allPassportDescription =
    this.lifePassportDescriptionService.listenAllPassportDescription();
  private readonly idCalculation =
    this.lifePassportDescriptionService.listenAllIdCalculations();

  constructor(
    private readonly lifePassportDescriptionService: LifePassportDescriptionService,
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
            this.dialog.open(UpdateAccountDialogComponent, {
              data: {
                uid: state.uid,
                email: state.email,
              },
              disableClose: true,
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.allPassportDescription.unsubscribe();
    this.idCalculation.unsubscribe();
  }
}
