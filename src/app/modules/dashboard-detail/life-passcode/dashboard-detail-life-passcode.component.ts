import { DatePipe, KeyValuePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { isNil } from 'ramda';
import { switchMap } from 'rxjs';
import { MyBasicInfo } from 'src/app/models/account';
import {
  LifePassport,
  LifePassportReviewResult,
} from 'src/app/models/life-passport';
import { DashboardDetailDataService } from 'src/app/modules/dashboard-detail/dashboard-detail-data.service';
import { LifePassportService } from '../../../services/life-passport/life-passport.service';

function countOccurrences(arr: number[]): Map<number, number> {
  const map = new Map<number, number>();

  arr.forEach((item) => {
    if (map.has(item)) {
      const count = map.get(item) || 0;
      map.set(item, count + 1);
    } else {
      map.set(item, 1);
    }
  });

  return map;
}

@Component({
  selector: 'app-dashboard-detail-life-passcode',
  templateUrl: './dashboard-detail-life-passcode.component.html',
  standalone: true,
  imports: [MatIconModule, DatePipe, KeyValuePipe],
})
export class DashboardDetailLifePasscodeComponent implements OnInit {
  user: MyBasicInfo | null = null;
  lifePassport: LifePassport | null = null;

  reviewResults: LifePassportReviewResult[] = [];

  innateCounts: Map<number, number> = new Map<number, number>();
  acquiredCounts: Map<number, number> = new Map<number, number>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly lifePassportService: LifePassportService,
    private readonly dashboardDetailDataService: DashboardDetailDataService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((map) =>
          this.dashboardDetailDataService.findTicket(map.get('ticketId')),
        ),
      )
      .subscribe((ticket) => {
        if (isNil(ticket)) {
          console.error('can not find ticket');
          return;
        }
        this.user = ticket.basicInfo;
        const data = this.lifePassportService.analyzeLifePasscode(
          this.user.birthday,
        );

        this.reviewResults = data.review.results;
        this.lifePassport = data.passport;
        this.innateCounts = countOccurrences(data.passport.innateNumbers);
        this.acquiredCounts = countOccurrences(data.passport.acquiredNumbers);
      });

    const id = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (isNil(id)) {
      return;
    }
  }
}
