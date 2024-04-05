import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import {
  CrystalAccessory,
  CrystalAccessoryType,
} from 'src/app/models/crystal-accessory';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';

@Component({
  selector: 'app-crystal-accessories',
  standalone: true,
  imports: [MatTabsModule, MatDialogModule, MatButtonModule, AsyncPipe],
  templateUrl: './crystal-accessories.component.html',
  styles: ``,
})
export class CrystalAccessoriesComponent {
  crystalAccessoryType$ = this.crystalService.getCrystalAccessoryType();
  selectedAccessories: CrystalAccessory[] = [];

  constructor(private readonly crystalService: CrystalProductService) {}

  getTypeKeys(types: Record<CrystalAccessoryType, CrystalAccessory[]>) {
    return Object.keys(types) as CrystalAccessoryType[];
  }

  onSelectAccessory(accessory: CrystalAccessory, event: Event) {
    (event.target as HTMLInputElement).checked
      ? this.selectedAccessories.push(accessory)
      : (this.selectedAccessories = this.selectedAccessories.filter(
          (data) => data.id !== accessory.id,
        ));
  }
}
