import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { CrystalAccessoryType } from 'src/app/enums/accessory-type.enum';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { UpdateAccessoryCardComponent } from 'src/app/modules/dashboard-overview/updates/update-accessories/update-accessory-card/update-accessory-card.component';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';

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
  private loadingSubject = new BehaviorSubject(false);
  private accessoryType = CrystalAccessoryType.Satellite;

  loading$ = this.loadingSubject.asObservable();
  crystals: Record<string, CrystalAccessory> | null = null;
  private tempFile: File | null = null;

  constructor(
    private readonly crystalService: CrystalProductService,
    private readonly route: ActivatedRoute,
  ) {
    this.route.params
      .pipe(
        tap(() => this.loadingSubject.next(true)),
        tap((params) => (this.accessoryType = params['type'])),
        switchMap((params) =>
          this.crystalService.getCrystalAccessoriesByType(params['type']),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((data) => {
        this.crystals = data;
        this.loadingSubject.next(false);
      });
  }

  onAddCrystalAccessory() {
    this.crystalService.addCrystalAccessory(this.accessoryType);
  }

  onUpdateCrystalAccessory(key: string, accessory: CrystalAccessory) {
    if (this.tempFile) {
      this.crystalService.onUpdateCrystalAccessoryWithImage(
        key,
        this.tempFile,
        accessory,
        this.accessoryType,
      );
      this.tempFile = null;
      return;
    }
    this.crystalService.updateCrystalAccessory(
      key,
      accessory,
      this.accessoryType,
    );
  }

  onUploadImage(file: File) {
    this.tempFile = file;
  }

  onDeleteCrystalAccessory(id: string, currentImg: string) {
    this.crystalService.removeCrystalAccessory(
      id,
      currentImg,
      this.accessoryType,
    );
  }
}
