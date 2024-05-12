import { CommonModule, Location } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { isNil } from 'ramda';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { DotsComponent } from 'src/app/components/dots/dots.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { CrystalMythicalBeastType } from 'src/app/enums/accessory-type.enum';
import { AccessoryCartItem, CartItem } from 'src/app/models/cart';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessoryDialogComponent } from 'src/app/modules/crystals-showroom/crystal-accessory-dialog/crystal-accessory-dialog.component';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { CrystalProductService } from 'src/app/services/crystal-product/crystal-product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-crystal-detail',
  standalone: true,
  imports: [
    CommonModule,
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
  totalPrice = computed(() => this.itemPrice() * this.crystalQuantity());
  itemPrice = computed(
    () => Number(this.crystal?.price || 0) + this.crystalAccessoryPrice(),
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

  accessoryCartItems: Map<string, number> = new Map();

  mandatorySelectedAccessories: AccessoryCartItem[] = [];
  mandatoryAccessoryPrice = 0;
  mandatoryPriceText = '';

  optionalSelectedAccessories: AccessoryCartItem[] = [];
  optionalAccessoryPrice = 0;
  optionalPriceText = '';

  pendantSelectedAccessories: AccessoryCartItem[] = [];
  pendantAccessoryPrice = 0;
  pendantPriceText = '';

  onAddToCart() {
    if (this.crystalId && this.crystal) {
      const cartItem: CartItem = {
        crystal: this.crystal,
        mandatoryAccessories: this.mandatorySelectedAccessories,
        optionalAccessories: this.optionalSelectedAccessories,
        pendantAccessories: this.pendantSelectedAccessories,
        quantity: this.crystalQuantity(),
        itemPrice: this.itemPrice(),
        createdAt: dayjs().toISOString(),
      };

      this.shoppingCartService.addToCart(this.crystalId, cartItem);
    }
  }

  onGoBack() {
    this.location.back();
  }

  openMandatoryCrystalAccessoryDialog() {
    if (isNil(this.crystal)) {
      return;
    }

    const dialogRef = this.matDialog.open(CrystalAccessoryDialogComponent, {
      minWidth: '300px',
      width: '80%',
      minHeight: '80vh',
      data: {
        showSelections: this.crystal.mandatoryTypes,
        discount: this.crystal.mandatoryDiscount || 0,
        selectedAccessories: this.mandatorySelectedAccessories,
        singleSelect: Object.values(CrystalMythicalBeastType).some((data) =>
          this.crystal?.mandatoryTypes.includes(data),
        ),
      },
    });

    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          type: string;
          accessories: AccessoryCartItem[];
          totalPrice: number;
          showTotalPriceText: string;
        }) => {
          if (result.type === 'cancel') {
            return;
          }
          this.mandatorySelectedAccessories = result.accessories;
          this.mandatoryAccessoryPrice = result.totalPrice;
          this.mandatoryPriceText = result.showTotalPriceText;
          this.crystalAccessoryPrice.set(
            this.mandatoryAccessoryPrice +
              this.optionalAccessoryPrice +
              this.pendantAccessoryPrice,
          );
        },
      );
  }

  openOptionalCrystalAccessoryDialog() {
    if (isNil(this.crystal)) {
      return;
    }

    const dialogRef = this.matDialog.open(CrystalAccessoryDialogComponent, {
      minWidth: '300px',
      width: '80%',
      minHeight: '80vh',
      data: {
        showSelections: this.crystal.optionalTypes,
        discount: 0,
        selectedAccessories: this.optionalSelectedAccessories,
        singleSelect: true,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          type: string;
          accessories: AccessoryCartItem[];
          totalPrice: number;
          showTotalPriceText: string;
        }) => {
          if (result.type === 'cancel') {
            return;
          }
          this.optionalSelectedAccessories = result.accessories;
          this.optionalAccessoryPrice = result.totalPrice;
          this.optionalPriceText = result.showTotalPriceText;
          this.crystalAccessoryPrice.set(
            this.mandatoryAccessoryPrice +
              this.optionalAccessoryPrice +
              this.pendantAccessoryPrice,
          );
        },
      );
  }

  openPendantCrystalAccessoryDialog() {
    if (isNil(this.crystal)) {
      return;
    }

    const dialogRef = this.matDialog.open(CrystalAccessoryDialogComponent, {
      minWidth: '300px',
      width: '80%',
      minHeight: '80vh',
      data: {
        showSelections: this.crystal.pendantTypes,
        discount: this.crystal.pendantDiscount,
        selectedAccessories: this.pendantSelectedAccessories,
        hasWorkFee: true,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          type: string;
          accessories: AccessoryCartItem[];
          totalPrice: number;
          showTotalPriceText: string;
        }) => {
          if (result.type === 'cancel') {
            return;
          }

          this.pendantSelectedAccessories = result.accessories;
          this.pendantAccessoryPrice = result.totalPrice;
          this.pendantPriceText = result.showTotalPriceText;
          this.crystalAccessoryPrice.set(
            this.mandatoryAccessoryPrice +
              this.optionalAccessoryPrice +
              this.pendantAccessoryPrice,
          );
        },
      );
  }
}
