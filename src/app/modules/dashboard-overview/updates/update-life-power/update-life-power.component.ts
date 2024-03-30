import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { Gender } from 'src/app/consts/gender';
import { LifeType } from 'src/app/consts/life-type';
import { Crystal } from 'src/app/models/crystal';
import { UpdatedCardComponent } from 'src/app/modules/dashboard-overview/updates/updated-card/updated-card.component';
import { CrystalService } from 'src/app/services/crystal/crystal.service';

@Component({
  selector: 'app-update-life-power',
  standalone: true,
  imports: [
    CommonModule,
    UpdatedCardComponent,
    MatTabsModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-life-power.component.html',
  styles: ``,
})
export class UpdateLifePowerComponent {
  private genderSubject = new BehaviorSubject(Gender.Female);
  private loadingSubject = new BehaviorSubject(false);

  loading$ = this.loadingSubject.asObservable();
  healthCrystals: Crystal[] = [];

  constructor(private readonly crystalService: CrystalService) {
    this.loading$.subscribe((status) => {
      console.log('data' + status);
    });

    this.genderSubject
      .asObservable()
      .pipe(
        tap(() => this.loadingSubject.next(true)),
        switchMap((gender) =>
          this.crystalService.getCrystals(gender, LifeType.Health),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((data) => {
        this.healthCrystals = data;
        console.log(data);
        this.loadingSubject.next(false);
      });
  }

  onUpdateTab(data: MatTabChangeEvent) {
    const gender = data.index === 1 ? Gender.Male : Gender.Female;
    this.genderSubject.next(gender);
  }
}
