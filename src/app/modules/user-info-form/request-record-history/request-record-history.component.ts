import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { RecipientInformationComponent } from 'src/app/components/recipient-information/recipient-information.component';
import { RemittanceStateComponent } from 'src/app/components/remittance-state/remittance-state.component';
import {
  CalculationFeedbackStateMap,
  CalculationRemittanceState,
} from 'src/app/enums/request-record.enum';
import { RequestRecord } from 'src/app/models/account';
import { SortByPipe } from 'src/app/pipes/sortBy.pipe';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { AccountService } from 'src/app/services/account/account.service';
import { UserBank } from 'src/app/services/bank/bank.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';
import { RequestRecordCardComponent } from '../request-record-card/request-record-card.component';

@Component({
  selector: 'app-request-record-history',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RequestRecordCardComponent,
    SortByPipe,
    RecipientInformationComponent,
    RemittanceStateComponent,
    TwCurrencyPipe,
  ],
  templateUrl: './request-record-history.component.html',
  styles: ``,
})
export class RequestRecordHistoryComponent {
  records$: Observable<RequestRecord[]> = of([]);

  CalculationRemittanceState = CalculationRemittanceState;
  CalculationFeedbackStateMap = CalculationFeedbackStateMap;

  constructor(
    private readonly request: CalculationRequestService,
    private readonly account: AccountService,
    private readonly notifyService: NotifyService,
  ) {
    this.records$ = this.account.myAccount$.pipe(
      switchMap((account) => {
        if (account?.uid) {
          return this.request.getCalculationRequests(account.uid);
        }
        return of([]);
      }),
      tap((record) => console.log(record)),
    );

    this.notifyService.readNotify('request', 'customer');
  }

  updateRequestRecord(recordId: string, bank: UserBank, paid: number) {
    this.request.payRequestRecord(recordId, bank, paid);
    this.notifyService.updateNotify('request', 'customer');
  }
}
