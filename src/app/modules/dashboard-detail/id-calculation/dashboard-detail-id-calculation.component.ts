import { KeyValuePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { isNil } from 'src/app/common/utilities';
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
  user = signal<MyBasicInfo | null>(null);
  idReview = signal<Record<string, string>>({});

  private activatedRoute = inject(ActivatedRoute);
  private lifePassportService = inject(LifePassportService);
  private dashboardDetailDataService = inject(DashboardDetailDataService);

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
        const review = this.lifePassportService.analyzeID(
          this.user()?.nationalID || '',
        );
        let index = 0;
        const last = Object.keys(review).length - 1;

        const newIdReview: Record<string, string> = {};
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

          newIdReview[keyText] = `${value.join(',')}${idValuesAnalysis.join(
            ', ',
          )}`;
          index = index + 1;
        }
        this.idReview.set(newIdReview);
      });
  }
}
