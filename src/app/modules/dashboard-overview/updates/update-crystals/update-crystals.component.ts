import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, switchMap, timer } from 'rxjs';
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
  private crystalService = inject(CrystalProductService);
  private route = inject(ActivatedRoute);
  private routeParams = toSignal(this.route.params);

  gender = signal<Gender>(Gender.Female);
  loadingUpdating = signal<Record<string, boolean>>({});
  tempFile = signal<File | null>(null);

  lifeType = computed(
    () => (this.routeParams()?.['type'] as LifeType) || LifeType.Health,
  );

  crystalsData = toSignal(
    combineLatest([
      toObservable(this.gender),
      toObservable(this.lifeType),
    ]).pipe(
      switchMap(([gender, lifeType]) =>
        this.crystalService.getCrystalsByType(gender, lifeType),
      ),
      switchMap((data) => timer(600).pipe(map(() => data))),
      map((data) =>
        data.sort((a, b) =>
          new Date(a.createdTime).getTime() -
            new Date(b.createdTime).getTime() >
          0
            ? 1
            : -1,
        ),
      ),
    ),
    { initialValue: [] as Crystal[] },
  );

  loading = computed(() => this.crystalsData() === null);

  crystals = computed(() => this.crystalsData() || []);

  onUpdateTab(event: MatTabChangeEvent) {
    const gender = event.index === 1 ? Gender.Male : Gender.Female;
    this.gender.set(gender);
  }

  onAddCrystal() {
    this.crystalService.addCrystal(this.gender(), this.lifeType());
  }

  onUpdateCrystal(key: string, crystal: Crystal) {
    this.loadingUpdating.update((prev) => ({ ...prev, [key]: true }));

    const updateWithImg = () =>
      this.crystalService.onUpdateCrystalWithImage(
        key,
        this.tempFile()!,
        crystal,
        this.gender(),
        this.lifeType(),
      );

    const updateCrystal = () =>
      this.crystalService.updateCrystal(
        key,
        crystal,
        this.gender(),
        this.lifeType(),
      );

    const promise = this.tempFile() ? updateWithImg() : updateCrystal();

    promise
      .then(() => ensureMinimumLoadingTime())
      .then(() => {
        this.loadingUpdating.update((prev) => ({ ...prev, [key]: false }));
      });
  }

  onUploadImage(file: File) {
    this.tempFile.set(file);
  }

  onDeleteCrystal(id: string) {
    this.crystalService.removeCrystal(id, this.gender(), this.lifeType());
  }
}
