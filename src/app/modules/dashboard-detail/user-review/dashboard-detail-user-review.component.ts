import { KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { LifePassportService } from 'src/app/services/life-passport/life-passport.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard-detail-user-review',
  templateUrl: './dashboard-detail-user-review.component.html',
  standalone: true,
  imports: [KeyValuePipe],
})
export class DashboardDetailUserReviewComponent {
  user: User | null = null;
  lifeReview: Map<number, string> | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly lifePassportService: LifePassportService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.parent?.paramMap.subscribe((map) => {
      this.user = this.userService.getUser(map.get('id'));

      if (this.user) {
        const passport = this.lifePassportService.calculate(this.user.birthday);

        this.lifeReview =
          this.lifePassportService.getReview(passport).resultMap;
      }
    });
  }
}
