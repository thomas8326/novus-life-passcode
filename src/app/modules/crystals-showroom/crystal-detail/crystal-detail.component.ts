import { CommonModule, Location } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { isNil } from 'ramda';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { DotsComponent } from 'src/app/components/dots/dots.component';
import { MessageSnackbarComponent } from 'src/app/components/message-snackbar/message-snackbar.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { ForceLoginDirective } from 'src/app/directives/force-login.directive';
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
    ForceLoginDirective,
    MatSnackBarModule,
  ],
  templateUrl: './crystal-detail.component.html',
  styles: ``,
})
export class CrystalDetailComponent {
  crystalId: string = '';
  crystal: Crystal | null = null;

  crystalQuantity = signal(1);
  crystalAccessoryPrice = signal(0);
  totalPrice = computed(() => this.discountPrice() * this.crystalQuantity());
  discountPrice = computed(
    () => Number(this.crystal?.price || 0) + this.crystalAccessoryPrice(),
  );
  showError = false;
  accessoryCartItems: Map<string, number> = new Map();

  mandatorySelectedAccessories: AccessoryCartItem[] = [];
  mandatoryOriginalAccessoryPrice = 0;
  mandatoryAccessoryPrice = 0;
  mandatoryPriceText = '';

  optionalSelectedAccessories: AccessoryCartItem[] = [];
  optionalOriginalAccessoryPrice = 0;
  optionalAccessoryPrice = 0;
  optionalPriceText = '';

  pendantSelectedAccessories: AccessoryCartItem[] = [];
  pendantOriginalAccessoryPrice = 0;
  pendantAccessoryPrice = 0;
  pendantPriceText = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private crystalProductService: CrystalProductService,
    private shoppingCartService: ShoppingCartService,
    private readonly matDialog: MatDialog,
    private readonly location: Location,
    private readonly snackBar: MatSnackBar,
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

  onAddToCart() {
    this.showError = true;
    if (
      this.crystalId &&
      this.crystal &&
      this.mandatorySelectedAccessories.length > 0
    ) {
      const cartItem: CartItem = {
        crystal: this.crystal,
        mandatoryAccessories: this.mandatorySelectedAccessories,
        optionalAccessories: this.optionalSelectedAccessories,
        pendantAccessories: this.pendantSelectedAccessories,
        quantity: this.crystalQuantity(),
        prices: {
          totalPrice: this.totalPrice(),
          discountPrice: this.discountPrice(),
          originalPrice:
            Number(this.crystal.price) +
            this.mandatoryOriginalAccessoryPrice +
            this.optionalOriginalAccessoryPrice +
            this.pendantOriginalAccessoryPrice,
          crystalPrice: Number(this.crystal.price),
          mandatoryItemsPrice: this.mandatoryAccessoryPrice,
          optionalItemsPrice: this.optionalAccessoryPrice,
          pendantItemsPrice: this.pendantAccessoryPrice,
        },
        createdAt: dayjs().toISOString(),
      };

      this.shoppingCartService.addToCart(this.crystalId, cartItem);
      this.snackBar.openFromComponent(MessageSnackbarComponent, {
        data: {
          message: '已加入購物車',
          messageType: 'success',
        },
        horizontalPosition: 'end',
        duration: 600,
      });
      this.reset();
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
          originalPrice: number;
          discountPrice: number;
          showDiscountPriceText: string;
        }) => {
          if (result?.type === 'confirm') {
            this.mandatorySelectedAccessories = result.accessories;
            this.mandatoryAccessoryPrice = result.discountPrice;
            this.mandatoryPriceText = result.showDiscountPriceText;
            this.mandatoryOriginalAccessoryPrice = result.originalPrice;

            this.crystalAccessoryPrice.set(
              this.mandatoryAccessoryPrice +
                this.optionalAccessoryPrice +
                this.pendantAccessoryPrice,
            );
          }
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
          originalPrice: number;
          discountPrice: number;
          showDiscountPriceText: string;
        }) => {
          if (result?.type === 'confirm') {
            this.optionalSelectedAccessories = result.accessories;
            this.optionalAccessoryPrice = result.discountPrice;
            this.optionalPriceText = result.showDiscountPriceText;
            this.optionalOriginalAccessoryPrice = result.originalPrice;
            this.crystalAccessoryPrice.set(
              this.mandatoryAccessoryPrice +
                this.optionalAccessoryPrice +
                this.pendantAccessoryPrice,
            );
          }
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
          originalPrice: number;
          discountPrice: number;
          showDiscountPriceText: string;
        }) => {
          if (result?.type === 'confirm') {
            this.pendantSelectedAccessories = result.accessories;
            this.pendantAccessoryPrice = result.discountPrice;
            this.pendantPriceText = result.showDiscountPriceText;
            this.optionalOriginalAccessoryPrice = result.originalPrice;
            this.crystalAccessoryPrice.set(
              this.mandatoryAccessoryPrice +
                this.optionalAccessoryPrice +
                this.pendantAccessoryPrice,
            );
          }
        },
      );
  }

  reset() {
    this.mandatorySelectedAccessories = [];
    this.mandatoryOriginalAccessoryPrice = 0;
    this.mandatoryAccessoryPrice = 0;
    this.mandatoryPriceText = '';
    this.optionalSelectedAccessories = [];
    this.optionalOriginalAccessoryPrice = 0;
    this.optionalAccessoryPrice = 0;
    this.optionalPriceText = '';
    this.pendantSelectedAccessories = [];
    this.pendantOriginalAccessoryPrice = 0;
    this.pendantAccessoryPrice = 0;
    this.pendantPriceText = '';
    this.crystalQuantity.set(1);
    this.crystalAccessoryPrice.set(0);
    this.showError = false;
    this.accessoryCartItems = new Map();
  }
}
