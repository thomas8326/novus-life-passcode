import { DatePipe, KeyValuePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { isNil } from 'src/app/common/utilities';
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
  private activatedRoute = inject(ActivatedRoute);
  private lifePassportService = inject(LifePassportService);
  private dashboardDetailDataService = inject(DashboardDetailDataService);

  user = signal<MyBasicInfo | null>(null);
  lifePassport = signal<LifePassport | null>(null);
  reviewResults = signal<LifePassportReviewResult[]>([]);

  innateCounts = computed(() => {
    const passport = this.lifePassport();
    return passport
      ? countOccurrences(passport.innateNumbers)
      : new Map<number, number>();
  });

  acquiredCounts = computed(() => {
    const passport = this.lifePassport();
    return passport
      ? countOccurrences(passport.acquiredNumbers)
      : new Map<number, number>();
  });

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
        this.user.set(ticket.basicInfo);
        const data = this.lifePassportService.analyzeLifePasscode(
          this.user()?.birthday || '',
        );

        this.reviewResults.set(data.review.results);
        this.lifePassport.set(data.passport);
      });

    const id = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (isNil(id)) {
      return;
    }
  }
}
