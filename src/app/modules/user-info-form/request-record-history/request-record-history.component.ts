import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { RequestRecord } from 'src/app/models/account';
import { SortByPipe } from 'src/app/pipes/sortBy.pipe';
import { AccountService } from 'src/app/services/account/account.service';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';
import { RequestRecordCardComponent } from '../request-record-card/request-record-card.component';

@Component({
  selector: 'app-request-record-history',
  standalone: true,
  imports: [AsyncPipe, RequestRecordCardComponent, SortByPipe],
  templateUrl: './request-record-history.component.html',
  styles: ``,
})
export class RequestRecordHistoryComponent {
  records$: Observable<RequestRecord[]> = of([]);

  constructor(
    private request: CalculationRequestService,
    private account: AccountService,
  ) {
    this.records$ = this.account.myAccount$.pipe(
      switchMap((account) => {
        if (account?.uid) {
          return this.request.getCalculationRequests(account.uid);
        }
        return of([]);
      }),
    );
  }
}
