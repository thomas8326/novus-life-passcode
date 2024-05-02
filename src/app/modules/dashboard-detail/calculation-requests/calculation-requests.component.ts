import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { RecordStatus } from 'src/app/enums/request-record.enum';
import { RequestRecord } from 'src/app/models/account';
import { RequestRecordCardComponent } from 'src/app/modules/user-info-form/request-record-card/request-record-card.component';
import { SortByPipe } from 'src/app/pipes/sortBy.pipe';
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
  ],
  templateUrl: './calculation-requests.component.html',
  styles: ``,
})
export class CalculationRequestsComponent implements OnInit {
  requestRecords: RequestRecord[] = [];
  RecordStatus = RecordStatus;

  private userId = '';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly request: CalculationRequestService,
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

  onSave(form: NgForm, recordId?: string) {
    if (form.valid && this.userId && recordId) {
      const newData: RequestRecord = {
        ...form.value,
        statusReason: form.value.statusReason || '',
      };

      this.request.updateCalculationRequest(this.userId, recordId, newData);
    }
  }
}
