import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import {
  CalculationFeedbackState,
  CalculationFeedbackStateMap,
  CalculationRemittanceState,
} from 'src/app/enums/request-record.enum';
import { RequestFeedback, RequestRecord } from 'src/app/models/account';
import { RequestRecordCardComponent } from 'src/app/modules/user-info-form/request-record-card/request-record-card.component';
import { SortByPipe } from 'src/app/pipes/sortBy.pipe';
import { AccountService } from 'src/app/services/account/account.service';
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
  ],
  templateUrl: './calculation-requests.component.html',
  styles: ``,
})
export class CalculationRequestsComponent implements OnInit {
  requestRecords: RequestRecord[] = [];

  RemittanceState = CalculationRemittanceState;
  FeedbackState = CalculationFeedbackState;
  CalculationFeedbackStateMap = CalculationFeedbackStateMap;

  private userId = '';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly request: CalculationRequestService,
    private readonly account: AccountService,
  ) {}

  ngOnInit(): void {
    const userId = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (userId) {
      this.userId = userId;
      this.request.getCalculationRequests(this.userId).subscribe((records) => {
        this.requestRecords = records;
      });
    }
  }

  onSave(form: NgForm, record: RequestRecord) {
    if (form.valid && this.userId && record.id) {
      const feedback = { ...form.value, createdAt: dayjs().toISOString() };
      const feedbackRecord: RequestFeedback = {
        ...feedback,
        updatedBy: this.account.getMyAccount()?.name,
      };

      const feedbacks: Partial<RequestRecord> = {
        feedback,
        feedbackRecords: [...record.feedbackRecords, feedbackRecord],
      };

      this.request.updateCalculationRequest(this.userId, record.id, feedbacks);
    }
  }
}
