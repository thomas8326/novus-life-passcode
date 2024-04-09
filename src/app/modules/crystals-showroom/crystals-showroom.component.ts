import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { GenderSelectionComponent } from 'src/app/components/gender-selection/gender-selection.component';
import { Gender } from 'src/app/enums/gender.enum';
import { LifeType } from 'src/app/enums/life-type.enum';
import { Crystal } from 'src/app/models/crystal';
import { CrystalProductCardComponent } from 'src/app/modules/crystals-showroom/crystal-product-card/crystal-product-card.component';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';

@Component({
  selector: 'app-crystals-showroom',
  standalone: true,
  imports: [
    CrystalProductCardComponent,
    AsyncPipe,
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterLink,
    GenderSelectionComponent,
  ],
  templateUrl: './crystals-showroom.component.html',
})
export class CrystalsShowroomComponent {
  LifeType = LifeType;
  Gender = Gender;

  gender: Gender = Gender.Female;
  selectedLifeType: LifeType[] = [];

  friendCrystals$: Observable<Map<string, Crystal> | null> = of(null);
  healthCrystals$: Observable<Map<string, Crystal> | null> = of(null);
  wealthCrystals$: Observable<Map<string, Crystal> | null> = of(null);

  constructor(
    private readonly crystalService: CrystalProductService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.route.queryParamMap.pipe(take(1)).subscribe((map) => {
      const gender = map.get('gender') as Gender;
      const type = map.get('type') as LifeType;

      this.selectedLifeType = type
        ? [type]
        : [LifeType.Friend, LifeType.Health, LifeType.Wealth];

      this.onSelectGender(gender || this.gender);
    });
  }

  onSelectGender(gender: Gender) {
    this.gender = gender;
    this.friendCrystals$ = this.crystalService.getCrystals(
      gender,
      LifeType.Friend,
    );
    this.healthCrystals$ = this.crystalService.getCrystals(
      gender,
      LifeType.Health,
    );
    this.wealthCrystals$ = this.crystalService.getCrystals(
      gender,
      LifeType.Wealth,
    );

    this.updateQueryParams();
  }

  onSelectLifeType(checked: boolean, value: LifeType) {
    if (checked) {
      this.selectedLifeType.push(value);
    } else {
      this.selectedLifeType = this.selectedLifeType.filter(
        (data) => data !== value,
      );
    }

    this.updateQueryParams();
  }

  private updateQueryParams() {
    this.router.navigate([], {
      queryParams: { gender: this.gender, type: this.selectedLifeType },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
