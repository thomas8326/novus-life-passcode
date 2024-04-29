import { Location } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { DotsComponent } from 'src/app/components/dots/dots.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { CartItem } from 'src/app/models/cart';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { CrystalAccessoryDialogComponent } from 'src/app/modules/crystals-showroom/crystal-accessory-dialog/crystal-accessory-dialog.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-crystal-detail',
  standalone: true,
  imports: [
    FirebaseImgUrlDirective,
    MatIconModule,
    MatTooltipModule,
    DividerComponent,
    CountHandlerComponent,
    DotsComponent,
    TwCurrencyPipe,
  ],
  templateUrl: './crystal-detail.component.html',
  styles: ``,
})
export class CrystalDetailComponent {
  crystalId: string = '';
  crystal: Crystal | null = null;

  crystalQuantity = signal(1);
  crystalAccessoryPrice = signal(0);
  totalPrice = computed(
    () =>
      (Number(this.crystal?.price || 0) + this.crystalAccessoryPrice()) *
      this.crystalQuantity(),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private crystalProductService: CrystalProductService,
    private shoppingCartService: ShoppingCartService,
    private readonly matDialog: MatDialog,
    private readonly location: Location,
  ) {
    this.activatedRoute.paramMap.subscribe((map) => {
      this.crystalId = map.get('id') || '';
      const category = map.get('category') || '';
      if (this.crystalId && category) {
        this.crystalProductService
          .getCrystal(category, this.crystalId)
          .then((crystal) => {
            this.crystal = crystal;
          });
      }
    });
  }

  selectedAccessories: CrystalAccessory[] = [];
  accessoryCartItems: Map<string, number> = new Map();

  openCrystalAccessoryDialog() {
    const dialogRef = this.matDialog.open(CrystalAccessoryDialogComponent, {
      minWidth: '300px',
      width: '80%',
      minHeight: '80vh',
      data: {
        discount: this.crystal?.mythicalBeastDiscount || 0,
        defaultAccessories: this.selectedAccessories,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { accessories: CrystalAccessory[] }) => {
        this.selectedAccessories = result.accessories;
        const accessoriesPrice = this.selectedAccessories.reduce(
          (acc, accessory) => {
            return acc + accessory.price * (accessory?.quantity || 1);
          },
          0,
        );

        this.crystalAccessoryPrice.set(accessoriesPrice);
      });
  }

  onAddToCart() {
    if (this.crystalId && this.crystal) {
      const cartItem: CartItem = {
        crystalId: this.crystalId,
        quantity: this.crystalQuantity(),
        accessories: this.selectedAccessories.map((accessory) => ({
          accessoryId: accessory.id || '',
          quantity: accessory.quantity || 1,
        })),
        totalPrice: this.totalPrice(),
        createdAt: dayjs().toISOString(),
      };

      this.shoppingCartService.addToCart(cartItem);
    }
  }

  onGoBack() {
    this.location.back();
  }
}
