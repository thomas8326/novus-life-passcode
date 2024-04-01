import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, switchMap, tap } from 'rxjs';
import { Gender } from 'src/app/consts/gender';
import { LifeType } from 'src/app/consts/life-type';
import { Crystal } from 'src/app/models/crystal';
import { UpdatedCardComponent } from 'src/app/modules/dashboard-overview/updates/updated-card/updated-card.component';
import { CrystalProductService } from 'src/app/services/crystal/crystal.service';

@Component({
  selector: 'app-update-page',
  standalone: true,
  imports: [
    CommonModule,
    UpdatedCardComponent,
    MatTabsModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-page.component.html',
  styles: ``,
})
export class UpdatePageComponent {
  private genderSubject = new BehaviorSubject(Gender.Female);
  private loadingSubject = new BehaviorSubject(false);
  private lifeType = LifeType.Health;

  loading$ = this.loadingSubject.asObservable();
  healthCrystals: Crystal[] = [];

  constructor(
    private readonly crystalService: CrystalProductService,
    private readonly route: ActivatedRoute,
  ) {
    combineLatest([this.genderSubject, this.route.params])
      .pipe(
        tap(() => this.loadingSubject.next(true)),
        tap(([_, params]) => (this.lifeType = params['type'])),
        switchMap(([gender, params]) =>
          this.crystalService.getCrystals(gender, params['type']),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((data) => {
        this.healthCrystals = data;
        this.loadingSubject.next(false);
      });
  }

  onUpdateTab(data: MatTabChangeEvent) {
    const gender = data.index === 1 ? Gender.Male : Gender.Female;
    this.genderSubject.next(gender);
  }

  onAddCrystal(crystal: Crystal) {
    this.crystalService.addCrystal(
      crystal,
      this.genderSubject.value,
      this.lifeType,
    );
  }

  onUpdateCrystal(crystal: Crystal) {}

  onDeleteCrystal(id: string) {}
}
