import { AsyncPipe, CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { Gender } from 'src/app/consts/gender';
import { LifeType } from 'src/app/consts/life-type';
import { Crystal } from 'src/app/models/crystal';
import { CrystalProductCardComponent } from 'src/app/modules/crystals-showroom/crystal-product-card/crystal-product-card.component';
import { CrystalService } from 'src/app/services/crystal/crystal.service';


@Component({
  selector: 'app-crystals-showroom',
  standalone: true,
  imports: [CrystalProductCardComponent, AsyncPipe, CommonModule],
  templateUrl: './crystals-showroom.component.html',
})
export class CrystalsShowroomComponent {
  LifeType = LifeType;

  friendCrystals$: Observable<Crystal[]> = of([]);
  healthCrystals$: Observable<Crystal[]> = of([]);
  wealthCrystals$: Observable<Crystal[]> = of([]);

  constructor(private crystalService: CrystalService, private route: ActivatedRoute, private viewportScroller: ViewportScroller) {
    combineLatest([this.route.params, this.route.queryParams]).pipe(takeUntilDestroyed()).subscribe(([params, queryParams]) => {
      console.log(params);
      console.log(queryParams);

      const type = params['type'] || LifeType.Life;
      const gender = queryParams['gender'] || Gender.Male;

      this.viewportScroller.scrollToAnchor(type);

      this.friendCrystals$ = this.crystalService.getCrystals(gender, LifeType.Friends);
      this.healthCrystals$ = this.crystalService.getCrystals(gender, LifeType.Life);
      this.wealthCrystals$ = this.crystalService.getCrystals(gender, LifeType.Wealth);
    });
  }

}
