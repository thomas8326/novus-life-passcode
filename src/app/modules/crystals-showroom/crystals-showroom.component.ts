import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Gender } from 'src/app/consts/gender';
import { LifeType } from 'src/app/consts/life-type';
import { Crystal } from 'src/app/models/crystal';
import { CrystalProductCardComponent } from 'src/app/modules/crystals-showroom/crystal-product-card/crystal-product-card.component';
import { CrystalService } from 'src/app/services/crystal/crystal.service';

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
  ],
  templateUrl: './crystals-showroom.component.html',
})
export class CrystalsShowroomComponent {
  LifeType = LifeType;
  Gender = Gender;

  gender: Gender = Gender.Female;
  selectedLifeType: LifeType[] = [
    LifeType.Friend,
    LifeType.Health,
    LifeType.Wealth,
  ];

  friendCrystals$: Observable<Crystal[]> = of([]);
  healthCrystals$: Observable<Crystal[]> = of([]);
  wealthCrystals$: Observable<Crystal[]> = of([]);

  constructor(private crystalService: CrystalService) {
    this.getData(Gender.Female);
  }

  getData(gender: Gender) {
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
  }

  onSelect(checked: boolean, value: LifeType) {
    if (checked) {
      this.selectedLifeType.push(value);
    } else {
      this.selectedLifeType = this.selectedLifeType.filter(
        (data) => data !== value,
      );
    }
  }
}
