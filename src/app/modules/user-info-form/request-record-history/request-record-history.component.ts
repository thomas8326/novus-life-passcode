import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import {
  CalculationFeedbackStateMap,
  CalculationRemittanceState,
} from 'src/app/enums/request-record.enum';
import { RequestRecord } from 'src/app/models/account';
import { SortByPipe } from 'src/app/pipes/sortBy.pipe';
import { AccountService } from 'src/app/services/account/account.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';
import { RequestRecordCardComponent } from '../request-record-card/request-record-card.component';

@Component({
  selector: 'app-request-record-history',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RequestRecordCardComponent, SortByPipe],
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
    );

    this.notifyService.readNotify('request', 'customer');
  }

  updateRequestRecord(recordId: string, state: CalculationRemittanceState) {
    this.request.updateCalculationRemittanceState(recordId, state);
    this.notifyService.updateNotify('request', 'customer');
  }
}
