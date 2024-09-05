import { KeyValuePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ID_TABLE_KEY_DETAIL_MAP,
  ID_TABLE_MAP,
  ID_TEXT_MAP,
} from 'src/app/consts/life-passport.const';
import { IDKey } from 'src/app/models/life-passport';
import { LifePassportService } from 'src/app/services/life-passport/life-passport.service';

@Component({
  selector: 'app-dashboard-detail-id-calculation',
  templateUrl: './dashboard-detail-id-calculation.component.html',
  standalone: true,
  imports: [KeyValuePipe],
})
export class DashboardDetailIdCalculationComponent {
  idReview = signal<
    { age: string; symbol: string; symbolText: string; description: string }[]
  >([]);

  user = inject<{ name: string; birthday: string; nationalID: string }>(
    MAT_DIALOG_DATA,
  );

  private lifePassportService = inject(LifePassportService);

  ngOnInit(): void {
    const review = this.lifePassportService.analyzeID(
      this.user?.nationalID || '',
    );
    let index = 0;
    const last = Object.keys(review).length - 1;

    for (let [key, value] of Object.entries(review)) {
      const isLast = index === last;
      const keyText = `${key} - ${Number(key) + (isLast ? 20 : 5)}`;

      const idValueSet = new Set<IDKey>();
      value.forEach((v) => idValueSet.add(ID_TABLE_MAP[v]));

      const idValuesAnalysis = Array.from(idValueSet).map((idValue) => ({
        symbolText: ID_TEXT_MAP.get(idValue) || '暫無',
        description: ID_TABLE_KEY_DETAIL_MAP[idValue] || '暫無',
      }));

      this.idReview.update((idReview) => [
        ...idReview,
        {
          age: keyText,
          symbol: value.join(','),
          symbolText: idValuesAnalysis.map((v) => v.symbolText).join(', '),
          description: idValuesAnalysis.map((v) => v.description).join(', '),
        },
      ]);

      index = index + 1;
    }
  }
}
