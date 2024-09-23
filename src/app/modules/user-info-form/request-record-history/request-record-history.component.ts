import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { RecipientInfoDisplayComponent } from 'src/app/components/recipient-information/recipient-info-display.component';
import { RemittanceStateComponent } from 'src/app/components/remittance-state/remittance-state.component';
import {
  CalculationFeedbackStateMap,
  CalculationRemittanceState,
} from 'src/app/enums/request-record.enum';
import { RequestRecord } from 'src/app/models/account';
import { Pay } from 'src/app/models/pay';
import { SortByPipe } from 'src/app/pipes/sortBy.pipe';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { AccountService } from 'src/app/services/account/account.service';
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
    RecipientInfoDisplayComponent,
    RemittanceStateComponent,
    TwCurrencyPipe,
  ],
  template: `
    <div class="w-full h-full flex justify-center py-5">
      <div class="w-[90%] sm:w-[80%]">
        <app-recipient-info-display></app-recipient-info-display>
        <div class="flex flex-col items-center gap-4 pb-5 my-4 h-full">
          @for (item of records() | sortBy: 'created' : false; track $index) {
            @if (item.id) {
              <div class="w-full bg-white flex flex-col">
                <div class="flex flex-col justify-center px-4 py-4 border-b">
                  <div>訂單編號：{{ item.id }}</div>
                  <div>
                    訂單日期：{{ item.createdAt | date: 'YYYY/MM/dd HH:mm' }}
                  </div>
                  <div>訂單金額：{{ item.prices.totalPrice | twCurrency }}</div>
                </div>
                <div class="flex-1">
                  <app-request-record-card
                    [record]="item"
                  ></app-request-record-card>
                </div>
                <div class="flex gap-2 items-center border-t p-4">
                  <app-remittance-state
                    [remittance]="item.remittance"
                    [remittanceStates]="item.remittanceStates"
                    [totalPrices]="item.prices.totalPrice || 500"
                    (update)="updateRequestRecord(item.id, $event)"
                  ></app-remittance-state>
                </div>
                <div class="flex flex-col gap-2 border-t p-4">
                  <div class="font-bold">
                    訂單狀態：{{
                      CalculationFeedbackStateMap[item.feedback.state]
                    }}
                  </div>
                  @if (item.feedback.reason) {
                    <div>Novus對你說：</div>
                    <p class="px-4">{{ item.feedback.reason }}</p>
                  }
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class RequestRecordHistoryComponent {
  private request = inject(CalculationRequestService);
  private account = inject(AccountService);
  private notifyService = inject(NotifyService);

  private accountUid = computed(() => this.account.myAccount()?.uid);
  private recordsObservable = toObservable(this.accountUid).pipe(
    switchMap((uid) =>
      uid ? this.request.getCalculationRequests(uid) : of([]),
    ),
  );

  records = toSignal(this.recordsObservable, {
    initialValue: [] as RequestRecord[],
  });

  CalculationRemittanceState = CalculationRemittanceState;
  CalculationFeedbackStateMap = CalculationFeedbackStateMap;

  constructor() {
    this.notifyService.readNotify('request', 'customer');
  }

  updateRequestRecord(recordId: string, pay: Pay) {
    this.request.payRequestRecord(recordId, pay);
    this.notifyService.updateNotify('request', 'customer');
  }
}
