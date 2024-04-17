import { KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNil } from 'ramda';
import { switchMap } from 'rxjs';
import {
  ID_TABLE_KEY_DETAIL_MAP,
  ID_TABLE_MAP,
  ID_TEXT_MAP,
} from 'src/app/consts/life-passport.const';
import { MyBasicInfo } from 'src/app/models/account';
import { IDKey } from 'src/app/models/life-passport';
import { DashboardDetailDataService } from 'src/app/modules/dashboard-detail/dashboard-detail-data.service';
import { LifePassportService } from 'src/app/services/life-passport/life-passport.service';

@Component({
  selector: 'app-dashboard-detail-id-calculation',
  templateUrl: './dashboard-detail-id-calculation.component.html',
  standalone: true,
  imports: [KeyValuePipe],
})
export class DashboardDetailIdCalculationComponent {
  user: MyBasicInfo | null = null;
  idReview: Record<string, string> = {};

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
        const review = this.lifePassportService.analyzeID(this.user.nationalID);
        let index = 0;
        const last = Object.keys(review).length - 1;

        for (let [key, value] of Object.entries(review)) {
          const isLast = index === last;
          const keyText = `${key} - ${Number(key) + (isLast ? 20 : 5)}`;

          const idValueSet = new Set<IDKey>();
          value.forEach((v) => idValueSet.add(ID_TABLE_MAP[v]));

          const idValuesAnalysis = Array.from(idValueSet).map(
            (idValue) =>
              `(${ID_TEXT_MAP.get(idValue)}) => ${
                ID_TABLE_KEY_DETAIL_MAP[idValue]
              }`,
          );

          this.idReview[keyText] = `${value.join(',')}${idValuesAnalysis.join(
            ', ',
          )}`;
          index = index + 1;
        }
      });
  }
}
