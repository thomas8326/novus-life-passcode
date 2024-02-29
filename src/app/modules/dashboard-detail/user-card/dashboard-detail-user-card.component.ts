import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { LifePassport } from 'src/app/models/life-passport';
import { Member } from 'src/app/models/member';
import { MemberService } from 'src/app/services/member/member.service';
import { LifePassportService } from '../../../services/life-passport/life-passport.service';

@Component({
  selector: 'app-dashboard-detail-user-card',
  templateUrl: './dashboard-detail-user-card.component.html',
  standalone: true,
  imports: [MatIconModule, DatePipe],
})
export class DashboardDetailUserCardComponent implements OnInit {
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
    this.activatedRoute.parent?.paramMap.subscribe((map) => {
      this.user = this.userService.getMember(map.get('id'));

      if (this.user) {
        this.lifePassport = this.lifePassportService.calculate(
          new Date(this.user.birthday).toISOString(),
        );
        this.lifePassport.innateNumbers.forEach((value) => {
          const count = this.innateCounts?.get(value) || 0;
          this.innateCounts?.set(value, count + 1);
        });
        this.lifePassport.acquiredNumbers.forEach((value) => {
          const count = this.innateCounts?.get(value) || 0;
          this.acquiredCounts?.set(value, count + 1);
        });

        this.lifeReview = this.lifePassportService.getReview(
          this.lifePassport,
        ).resultMap;
      }
    });
  }
}
