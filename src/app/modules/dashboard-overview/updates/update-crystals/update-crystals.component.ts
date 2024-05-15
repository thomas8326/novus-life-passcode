import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  finalize,
  map,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { Gender } from 'src/app/enums/gender.enum';
import { LifeType } from 'src/app/enums/life-type.enum';
import { Crystal } from 'src/app/models/crystal';
import { UpdateCrystalCardComponent } from 'src/app/modules/dashboard-overview/updates/update-crystals/update-crystal-card/update-crystal-card.component';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';
import { ensureMinimumLoadingTime } from 'src/app/utilities/timer';

@Component({
  selector: 'app-update-crystals',
  standalone: true,
  imports: [
    CommonModule,
    UpdateCrystalCardComponent,
    MatTabsModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-crystals.component.html',
  styles: ``,
})
export class UpdateCrystalsComponent {
  private genderSubject = new BehaviorSubject(Gender.Female);
  private loadingSubject = new BehaviorSubject(false);
  private lifeType = LifeType.Health;
  private loadDataStartTime = Date.now();
  private tempFile: File | null = null;
  private updatingCrystalSubject = new BehaviorSubject<{
    id: string;
    loading: boolean;
  }>({ id: '', loading: false });

  loading$ = this.loadingSubject.pipe(
    finalize(() => {
      const loadingDelay = timer(800).pipe(
        tap(() => this.loadingSubject.next(false)),
      );

      loadingDelay.subscribe();
    }),
  );
  loadingUpdating$ = this.updatingCrystalSubject.asObservable();
  crystals: Crystal[] = [];

  constructor(
    private readonly crystalService: CrystalProductService,
    private readonly route: ActivatedRoute,
  ) {
    combineLatest([this.genderSubject, this.route.params])
      .pipe(
        tap(() => this.loadingSubject.next(true)),
        tap(([_, params]) => (this.lifeType = params['type'])),
        tap(() => (this.loadDataStartTime = Date.now())),
        switchMap(([gender, params]) =>
          this.crystalService.getCrystalsByType(gender, params['type']),
        ),
        switchMap((data) => {
          const elapsedTime = Date.now() - this.loadDataStartTime;
          if (elapsedTime >= 600) {
            return of(data);
          }
          return timer(600 - elapsedTime).pipe(map(() => data));
        }),
        takeUntilDestroyed(),
      )
      .subscribe((data) => {
        this.crystals = data.sort((a, b) =>
          new Date(a.createdTime).getTime() -
            new Date(b.createdTime).getTime() >
          0
            ? 1
            : -1,
        );

        this.loadingSubject.next(false);
      });
  }

  onUpdateTab(data: MatTabChangeEvent) {
    const gender = data.index === 1 ? Gender.Male : Gender.Female;
    this.genderSubject.next(gender);
  }

  onAddCrystal() {
    this.crystalService.addCrystal(this.genderSubject.value, this.lifeType);
  }

  onUpdateCrystal(key: string, crystal: Crystal) {
    this.updatingCrystalSubject.next({ id: key, loading: true });

    const updateWithImg = () =>
      this.crystalService.onUpdateCrystalWithImage(
        key,
        this.tempFile!,
        crystal,
        this.genderSubject.value,
        this.lifeType,
      );

    const updateCrystal = () =>
      this.crystalService.updateCrystal(
        key,
        crystal,
        this.genderSubject.value,
        this.lifeType,
      );

    const promise = this.tempFile ? updateWithImg() : updateCrystal();

    promise
      .then(() => ensureMinimumLoadingTime())
      .then(() => {
        this.updatingCrystalSubject.next({ id: key, loading: false });
      });
  }

  onUploadImage(file: File) {
    this.tempFile = file;
  }

  onDeleteCrystal(id: string) {
    this.crystalService.removeCrystal(
      id,
      this.genderSubject.value,
      this.lifeType,
    );
  }
}
