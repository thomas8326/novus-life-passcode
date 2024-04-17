import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute } from '@angular/router';
import { RecordStatus } from 'src/app/enums/request-record.enum';
import { RequestRecord } from 'src/app/models/account';
import { RequestRecordCardComponent } from 'src/app/modules/user-info-form/request-record-card/request-record-card.component';
import { SortByPipe } from 'src/app/pipes/sortBy.pipe';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-calculation-requests',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ReactiveFormsModule,
    RequestRecordCardComponent,
    SortByPipe,
    MatButtonToggleModule,
    MatButtonModule,
  ],
  templateUrl: './calculation-requests.component.html',
  styles: ``,
})
export class CalculationRequestsComponent implements OnInit {
  requestRecords: RequestRecord[] = [];
  RecordStatus = RecordStatus;

  recordForm: FormGroup = new FormGroup({
    records: new FormArray([]),
  });

  constructor(
    private readonly account: AccountService,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  get records(): FormArray {
    return this.recordForm.get('records') as FormArray;
  }

  ngOnInit(): void {
    const id = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (id) {
      this.account.getCalculationRequests(id).subscribe((records) => {
        this.requestRecords = records;

        for (let item of records) {
          this.records.push(
            new FormGroup({
              status: new FormControl<RecordStatus>(
                item.status || RecordStatus.Init,
              ),
              statusReason: new FormControl<string>(item?.statusReason || ''),
            }),
          );
        }
      });
    }
  }

  onSave(index: number) {
    const data = this.records.at(index);
    console.log('data', data);
  }
}
