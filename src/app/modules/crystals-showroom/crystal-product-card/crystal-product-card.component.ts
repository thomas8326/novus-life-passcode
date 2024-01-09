import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessoriesComponent } from 'src/app/modules/crystals-showroom/crystal-accessories/crystal-accessories.component';

@Component({
  selector: 'app-crystal-product-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './crystal-product-card.component.html',
  styles: ``,
})
export class CrystalProductCardComponent {
  @Input() crystal: Crystal | null = null;

  constructor(private readonly matDialog: MatDialog) {}

  openCrystalAccessoryDialog() {
    this.matDialog.open(CrystalAccessoriesComponent, {
      minWidth: '300px',
      width: '60%',
      height: '80%',
    });
  }
}