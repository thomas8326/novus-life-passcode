import { KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/models/member';
import { LifePassportService } from 'src/app/services/life-passport/life-passport.service';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-dashboard-detail-user-review',
  templateUrl: './dashboard-detail-user-review.component.html',
  standalone: true,
  imports: [KeyValuePipe],
})
export class DashboardDetailUserReviewComponent {
  user: Member | null = null;
  lifeReview: Map<number, string> | null = null;

  constructor(
    private readonly userService: MemberService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly lifePassportService: LifePassportService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.parent?.paramMap.subscribe((map) => {
      this.user = this.userService.getMember(map.get('id'));

      if (this.user) {
        const passport = this.lifePassportService.calculate(
          new Date(this.user.birthday).toISOString(),
        );

        this.lifeReview =
          this.lifePassportService.getReview(passport).resultMap;
      }
    });
  }
}
