import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { RemittanceStateDisplayComponent } from 'src/app/components/remittance-state/remittance-state-display.component';
import {
  CalculationFeedbackState,
  CalculationFeedbackStateMap,
  CalculationRemittanceState,
} from 'src/app/enums/request-record.enum';
import { RequestRecord } from 'src/app/models/account';
import { FortuneTellingComponent } from 'src/app/modules/dashboard-detail/components/fortune-telling.component';
import { RequestRecordCardComponent } from 'src/app/modules/user-info-form/request-record-card/request-record-card.component';
import { SortByPipe } from 'src/app/pipes/sortBy.pipe';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { AccountService } from 'src/app/services/account/account.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';

@Component({
  selector: 'app-calculation-requests',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule,
    RequestRecordCardComponent,
    SortByPipe,
    MatButtonToggleModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    DividerComponent,
    TwCurrencyPipe,
    FortuneTellingComponent,
    RemittanceStateDisplayComponent,
  ],
  templateUrl: './calculation-requests.component.html',
  styles: ``,
})
export class CalculationRequestsComponent implements OnInit {
  requestRecords = signal<RequestRecord[]>([]);
  userId = signal<string>('');

  RemittanceState = CalculationRemittanceState;
  FeedbackState = CalculationFeedbackState;
  CalculationFeedbackStateMap = CalculationFeedbackStateMap;

  sortedRequestRecords = computed(() =>
    [...this.requestRecords()].sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
    ),
  );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly request: CalculationRequestService,
    private readonly account: AccountService,
    private readonly notifyService: NotifyService,
  ) {}

  ngOnInit(): void {
    const userId = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (userId) {
      this.userId.set(userId);
      this.loadRequestRecords(userId);
      this.notifyService.readNotify('request', 'system', userId);
    }
  }

  loadRequestRecords(userId: string) {
    this.request.getCalculationRequests(userId).subscribe((records) => {
      this.requestRecords.set(records);
    });
  }

  onSave(form: NgForm, record: RequestRecord) {
    if (form.valid && this.userId() && record.id) {
      this.request
        .updateCalculationRequest(this.userId(), record.id, record)
        .then(() => {
          this.notifyService.updateNotify('request', 'system', this.userId());
        });
    }
  }

  updateRecord(recordId: string, updates: Partial<RequestRecord>) {
    this.requestRecords.update((records) =>
      records.map((record) =>
        record.id === recordId ? { ...record, ...updates } : record,
      ),
    );
  }

  updateFeedbackState(record: RequestRecord, state: CalculationFeedbackState) {
    this.updateRecord(record.id, {
      feedback: {
        ...record.feedback,
        state,
      },
    });
  }

  updateFeedbackReason(record: RequestRecord, reason: string) {
    this.updateRecord(record.id, {
      feedback: {
        ...record.feedback,
        reason,
        createdAt: dayjs().toISOString(),
      },
    });
  }
}
