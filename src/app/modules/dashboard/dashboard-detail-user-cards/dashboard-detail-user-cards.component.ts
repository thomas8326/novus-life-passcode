import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LifePassport } from 'src/app/models/life-passport';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { LifePassportService } from './../../../services/life-passport/life-passport.service';

@Component({
  selector: 'app-dashboard-detail-user-cards',
  templateUrl: './dashboard-detail-user-cards.component.html',
  styleUrls: ['./dashboard-detail-user-cards.component.scss'],
})
export class DashboardDetailUserCardsComponent implements OnInit {
  user: User | null = null;
  lifePassport: LifePassport | null = null;
  lifeReview: Map<number, string> | null = null;
  innateCounts: Map<number, number> = new Map<number, number>();
  acquiredCounts: Map<number, number> = new Map<number, number>();

  constructor(
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly lifePassportService: LifePassportService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.parent?.paramMap.subscribe((map) => {
      this.user = this.userService.getUser(map.get('id'));

      if (this.user) {
        this.lifePassport = this.lifePassportService.calculate(
          this.user.birthday
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
          this.lifePassport
        ).resultMap;
      }
    });
  }
}
