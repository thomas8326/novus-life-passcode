import { Injectable } from '@angular/core';
import { isNil } from 'ramda';
import { BehaviorSubject, map, of } from 'rxjs';
import { RequestRecord } from 'src/app/models/account';

@Injectable()
export class DashboardDetailDataService {
  private requestRecordsSubject = new BehaviorSubject<RequestRecord[]>([]);
  private requestMapSubject = new BehaviorSubject(
    new Map<string, RequestRecord>(),
  );

  requestRecords$ = this.requestRecordsSubject.asObservable();

  constructor() {}

  findTicket(ticketId: string | null) {
    if (isNil(ticketId)) {
      return of(null);
    }

    return this.requestMapSubject.pipe(map((data) => data.get(ticketId)));
  }

  updateUserRequestRecords(records: RequestRecord[]) {
    const requestMap = new Map<string, RequestRecord>();
    records.forEach((record) => {
      if (record.id) {
        requestMap.set(record.id, record);
      }
    });
    this.requestRecordsSubject.next(records);
    this.requestMapSubject.next(requestMap);
  }
}
