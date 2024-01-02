import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import {
  CrystalAccessory,
  CrystalAccessoryType,
} from 'src/app/models/crystal-accessory';
import { CrystalService } from 'src/app/services/crystal/crystal.service';

@Component({
  selector: 'app-crystal-accessories',
  standalone: true,
  imports: [MatTabsModule, MatDialogModule, MatButtonModule, AsyncPipe],
  templateUrl: './crystal-accessories.component.html',
  styles: ``,
})
export class CrystalAccessoriesComponent {
  crystalAccessoryType$ = this.crystalService.getCrystalAccessoryType();

  constructor(private readonly crystalService: CrystalService) {}

  getTypeKeys(types: Record<CrystalAccessoryType, CrystalAccessory[]>) {
    return Object.keys(types) as CrystalAccessoryType[];
  }
}
