import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { CrystalAccessoryType } from 'src/app/enums/accessory-type';
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

  constructor(
    private readonly crystalService: CrystalProductService,
    private readonly route: ActivatedRoute,
  ) {
    this.route.params
      .pipe(
        tap(() => this.loadingSubject.next(true)),
        tap((params) => (this.accessoryType = params['type'])),
        switchMap((params) =>
          this.crystalService.listenCrystalAccessories(params['type']),
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
    this.crystalService.updateCrystalAccessory(
      key,
      accessory,
      this.accessoryType,
    );
  }

  onUploadImage(id: string, file: File, image: string) {
    this.crystalService.onUploadCrystalAccessoryImage(
      id,
      file,
      image,
      this.accessoryType,
    );
  }

  onDeleteCrystalAccessory(id: string, currentImg: string) {
    this.crystalService.removeCrystalAccessory(
      id,
      currentImg,
      this.accessoryType,
    );
  }
}
