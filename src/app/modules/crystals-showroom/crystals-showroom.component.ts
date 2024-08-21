import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { GenderSelectionComponent } from 'src/app/components/gender-selection/gender-selection.component';
import { Gender } from 'src/app/enums/gender.enum';
import { LifeType } from 'src/app/enums/life-type.enum';
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
export class CrystalsShowroomComponent implements OnInit {
  LifeType = LifeType;
  Gender = Gender;

  gender = signal<Gender>(Gender.Female);
  selectedLifeType = signal<LifeType[]>([]);

  friendCrystals = toSignal(
    toObservable(this.gender).pipe(
      switchMap((gender) =>
        this.crystalService.getCrystalsByType(gender, LifeType.Friend),
      ),
    ),
  );
  healthCrystals = toSignal(
    toObservable(this.gender).pipe(
      switchMap((gender) =>
        this.crystalService.getCrystalsByType(gender, LifeType.Health),
      ),
    ),
  );
  wealthCrystals = toSignal(
    toObservable(this.gender).pipe(
      switchMap((gender) =>
        this.crystalService.getCrystalsByType(gender, LifeType.Wealth),
      ),
    ),
  );

  lifeTypeChecked = signal<Record<LifeType, boolean>>({
    [LifeType.Health]: false,
    [LifeType.Friend]: false,
    [LifeType.Wealth]: false,
  });

  constructor(
    private readonly crystalService: CrystalProductService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(take(1)).subscribe((map) => {
      const gender = map.get('gender') as Gender;
      const type = map.get('type') as LifeType;

      this.selectedLifeType.set(
        type ? [type] : [LifeType.Friend, LifeType.Health, LifeType.Wealth],
      );

      this.onSelectGender(gender || this.gender());
      this.updateLifeTypeChecked(this.selectedLifeType());
    });
  }

  onSelectGender(gender: Gender) {
    this.gender.set(gender);
    this.updateQueryParams();
  }

  onSelectLifeType(checked: boolean, value: LifeType) {
    this.lifeTypeChecked.update((current) => ({
      ...current,
      [value]: checked,
    }));

    this.selectedLifeType.update((types) => {
      if (checked) {
        return [...types, value];
      } else {
        return types.filter((data) => data !== value);
      }
    });

    this.updateQueryParams();
  }

  onGoToDetail(type: LifeType, id: string) {
    this.router.navigate(['crystal', `${this.gender()}_${type}`, id]);
  }

  private updateQueryParams() {
    this.router.navigate([], {
      queryParams: { gender: this.gender(), type: this.selectedLifeType() },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private updateLifeTypeChecked(selectedTypes: LifeType[]) {
    this.lifeTypeChecked.update((checked) => {
      Object.keys(checked).forEach((type) => {
        checked[type as LifeType] = selectedTypes.includes(type as LifeType);
      });
      return checked;
    });
  }
}
