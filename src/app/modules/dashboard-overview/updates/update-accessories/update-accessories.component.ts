import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import {
  CrystalAccessoryType,
  CrystalPendantType,
} from 'src/app/enums/accessory-type.enum';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { UpdateAccessoryCardComponent } from 'src/app/modules/dashboard-overview/updates/update-accessories/update-accessory-card/update-accessory-card.component';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';
import { ensureMinimumLoadingTime } from 'src/app/utilities/timer';

@Component({
  selector: 'app-update-accessories',
  standalone: true,
  imports: [
    CommonModule,
    UpdateAccessoryCardComponent,
    MatTabsModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-accessories.component.html',
  styles: ``,
})
export class UpdateAccessoriesComponent {
  private route = inject(ActivatedRoute);
  private crystalService = inject(CrystalProductService);

  accessoryType = signal<CrystalAccessoryType>(CrystalPendantType.Satellite);
  tempFile = signal<File | null>(null);
  loadingUpdating = signal<Record<string, boolean>>({});

  accessories = toSignal(
    this.route.params.pipe(
      switchMap((params) => {
        this.accessoryType.set(params['type']);
        return this.crystalService.getCrystalAccessoriesByType(params['type']);
      }),
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
    { initialValue: [] as CrystalAccessory[] },
  );

  loading = computed(() => this.accessories() === null);

  onAddCrystalAccessory() {
    this.crystalService.addCrystalAccessory(this.accessoryType());
  }

  onUpdateCrystalAccessory(key: string, accessory: CrystalAccessory) {
    this.loadingUpdating.update((prev) => ({ ...prev, [key]: true }));

    const updateWithImg = () =>
      this.crystalService.onUpdateCrystalAccessoryWithImage(
        key,
        this.tempFile()!,
        accessory,
        this.accessoryType(),
      );
    const updateAccessory = () =>
      this.crystalService.updateCrystalAccessory(
        key,
        accessory,
        this.accessoryType(),
      );

    const promise = this.tempFile() ? updateWithImg() : updateAccessory();

    promise
      .then(() => ensureMinimumLoadingTime())
      .then(() => {
        this.loadingUpdating.update((prev) => ({ ...prev, [key]: false }));
      });
  }

  onUploadImage(file: File) {
    this.tempFile.set(file);
  }

  onDeleteCrystalAccessory(id: string, currentImg: string) {
    this.crystalService.removeCrystalAccessory(
      id,
      currentImg,
      this.accessoryType(),
    );
  }
}
