import { AsyncPipe, CommonModule, ViewportScroller } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
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
export class CrystalsShowroomComponent implements AfterViewInit {
  LifeType = LifeType;

  friendCrystals$: Observable<Crystal[]> = of([]);
  healthCrystals$: Observable<Crystal[]> = of([]);
  wealthCrystals$: Observable<Crystal[]> = of([]);

  constructor(private crystalService: CrystalService, private route: ActivatedRoute, private viewportScroller: ViewportScroller) {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(queryParams => {
      const gender = queryParams['gender'] || Gender.Male;
      this.friendCrystals$ = this.crystalService.getCrystals(gender, LifeType.Friend);
      this.healthCrystals$ = this.crystalService.getCrystals(gender, LifeType.Health);
      this.wealthCrystals$ = this.crystalService.getCrystals(gender, LifeType.Wealth);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.route.paramMap.pipe().subscribe(params => {
        const anchor = params.get('type') || LifeType.Health;
        const targetElement = document.getElementById(anchor);

        targetElement?.scrollIntoView({ behavior: 'smooth' });
      });
    }, 1000);
  }

}
