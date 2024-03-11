import { DatePipe, KeyValuePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { isNil } from 'ramda';
import { LifePassport } from 'src/app/models/life-passport';
import { Member } from 'src/app/models/member';
import { MemberService } from 'src/app/services/member/member.service';
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
  user: Member | null = null;
  lifePassport: LifePassport | null = null;
  lifeReview: Map<number, string> | null = null;
  innateCounts: Map<number, number> = new Map<number, number>();
  acquiredCounts: Map<number, number> = new Map<number, number>();

  constructor(
    private readonly userService: MemberService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly lifePassportService: LifePassportService,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (isNil(id)) {
      return;
    }

    this.userService.getMember(id).subscribe((user) => {
      if (user) {
        this.user = user;
        const data = this.lifePassportService.analyzeLifePasscode(
          this.user.birthday,
        );
        this.lifeReview = data.review.resultMap;
        this.lifePassport = data.passport;
        this.innateCounts = countOccurrences(data.passport.innateNumbers);
        this.acquiredCounts = countOccurrences(data.passport.acquiredNumbers);
      }
    });
  }
}
