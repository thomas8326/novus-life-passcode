import { DatePipe, KeyValuePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  LifePassport,
  LifePassportReviewResult,
} from 'src/app/models/life-passport';
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
  private lifePassportService = inject(LifePassportService);
  user = inject<{ name: string; birthday: string; nationalID: string }>(
    MAT_DIALOG_DATA,
  );

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
    console.log(this.user);

    const data = this.lifePassportService.analyzeLifePasscode(
      this.user?.birthday || '',
    );
    this.reviewResults.set(data.review.results);
    this.lifePassport.set(data.passport);
  }
}
