import { KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNil } from 'ramda';
import {
  ID_TABLE_KEY_DETAIL_MAP,
  ID_TABLE_MAP,
} from 'src/app/consts/life-passport';
import { IDKey } from 'src/app/models/life-passport';
import { Member } from 'src/app/models/member';
import { LifePassportService } from 'src/app/services/life-passport/life-passport.service';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-dashboard-detail-id-calculation',
  templateUrl: './dashboard-detail-id-calculation.component.html',
  standalone: true,
  imports: [KeyValuePipe],
})
export class DashboardDetailIdCalculationComponent {
  user: Member | null = null;
  idReview: Record<string, string> = {};

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
        const review = this.lifePassportService.analyzeID(this.user.id);
        let index = 0;
        const last = Object.keys(review).length - 1;

        for (let [key, value] of Object.entries(review)) {
          const isLast = index === last;
          const keyText = `${key} - ${Number(key) + (isLast ? 20 : 5)}`;

          const idValueSet = new Set<IDKey>();
          value.forEach((v) => idValueSet.add(ID_TABLE_MAP[v]));

          const idValuesAnalysis = Array.from(idValueSet).map(
            (idValue) => `(${idValue}) => ${ID_TABLE_KEY_DETAIL_MAP[idValue]}`,
          );

          this.idReview[keyText] = `${value.join(',')}${idValuesAnalysis.join(
            ', ',
          )}`;
          index = index + 1;
        }
      }
    });
  }
}
