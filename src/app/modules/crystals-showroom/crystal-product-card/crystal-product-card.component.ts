import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { CartItem } from 'src/app/models/cart';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { CrystalAccessoryDialogComponent } from 'src/app/modules/crystals-showroom/crystal-accessory-dialog/crystal-accessory-dialog.component';

@Component({
  selector: 'app-crystal-product-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FirebaseImgUrlDirective,
  ],
  templateUrl: './crystal-product-card.component.html',
  styles: ``,
})
export class CrystalProductCardComponent {
  @Input() tempImage: string | null = null;
  @Input() crystalId: string = '';
  @Input() crystal: Crystal | null = null;
  @Output() addToCart = new EventEmitter<CartItem>();

  constructor(private readonly matDialog: MatDialog) {}

  selectedAccessoryId: string = '';
  selectedAccessory: CrystalAccessory | null = null;

  openCrystalAccessoryDialog() {
    const dialogRef = this.matDialog.open(CrystalAccessoryDialogComponent, {
      minWidth: '300px',
      width: '60%',
      minHeight: '60vh',
      data: {
        discount: this.crystal?.accessoryDiscount || 0,
        defaultAccessory: this.selectedAccessory,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { accessory: CrystalAccessory; id: string }) => {
        this.selectedAccessoryId = result.id;
        this.selectedAccessory = result.accessory;
      });
  }

  addCart() {
    this.addToCart.emit({
      crystalId: this.crystalId,
      accessoryId: this.selectedAccessoryId,
      quantity: 1,
    });
  }
}
