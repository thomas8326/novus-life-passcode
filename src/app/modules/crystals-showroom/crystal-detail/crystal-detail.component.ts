import { CommonModule, Location } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { isNil } from 'src/app/common/utilities';
import { CountHandlerComponent } from 'src/app/components/count-handler/count-handler.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { DotsComponent } from 'src/app/components/dots/dots.component';
import { ImageLoaderComponent } from 'src/app/components/image-loader/image-loader.component';
import { MessageSnackbarComponent } from 'src/app/components/message-snackbar/message-snackbar.component';
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
    ImageLoaderComponent,
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
  crystal = signal<Crystal | null>(null);
  crystalQuantity = signal(1);
  showMandatoryError = signal(false);

  mandatorySelectedAccessories = signal<AccessoryCartItem[]>([]);
  optionalSelectedAccessories = signal<AccessoryCartItem[]>([]);
  pendantSelectedAccessories = signal<AccessoryCartItem[]>([]);

  mandatoryAccessoryPrice = signal(0);
  optionalAccessoryPrice = signal(0);
  pendantAccessoryPrice = signal(0);

  mandatoryOriginalAccessoryPrice = signal(0);
  optionalOriginalAccessoryPrice = signal(0);
  pendantOriginalAccessoryPrice = signal(0);

  mandatoryPriceText = signal('');
  optionalPriceText = signal('');
  pendantPriceText = signal('');

  crystalAccessoryPrice = computed(
    () =>
      this.mandatoryAccessoryPrice() +
      this.optionalAccessoryPrice() +
      this.pendantAccessoryPrice(),
  );

  originalAccessoryPrice = computed(
    () =>
      this.mandatoryOriginalAccessoryPrice() +
      this.optionalOriginalAccessoryPrice() +
      this.pendantOriginalAccessoryPrice(),
  );

  discountPrice = computed(
    () => Number(this.crystal()?.price || 0) + this.crystalAccessoryPrice(),
  );

  originalPrice = computed(
    () => Number(this.crystal()?.price || 0) + this.originalAccessoryPrice(),
  );

  totalPrice = computed(() => this.discountPrice() * this.crystalQuantity());

  constructor(
    private activatedRoute: ActivatedRoute,
    private crystalProductService: CrystalProductService,
    private shoppingCartService: ShoppingCartService,
    private readonly matDialog: MatDialog,
    private readonly location: Location,
    private readonly snackBar: MatSnackBar,
  ) {
    this.activatedRoute.paramMap.subscribe((map) => {
      const crystalId = map.get('id') || '';
      const category = map.get('category') || '';
      if (crystalId && category) {
        this.crystalProductService
          .getCrystal(category, crystalId)
          .then((crystal) => {
            this.crystal.set(crystal);
          });
      }
    });
  }

  onAddToCart() {
    const crystal = this.crystal();
    if (isNil(crystal) || isNil(crystal.id)) {
      console.error('Crystal is not found');
      return;
    }

    if (
      crystal.mandatoryTypes?.length > 0 &&
      this.mandatorySelectedAccessories().length === 0
    ) {
      this.showMandatoryError.set(true);
      return;
    }

    const cartItem: CartItem = {
      crystal: crystal,
      mandatoryAccessories: this.mandatorySelectedAccessories(),
      optionalAccessories: this.optionalSelectedAccessories(),
      pendantAccessories: this.pendantSelectedAccessories(),
      quantity: this.crystalQuantity(),
      prices: {
        totalPrice: this.totalPrice(),
        discountPrice: this.discountPrice(),
        originalPrice: this.originalPrice(),
        crystalPrice: Number(crystal.price),
        mandatoryItemsPrice: this.mandatoryAccessoryPrice(),
        optionalItemsPrice: this.optionalAccessoryPrice(),
        pendantItemsPrice: this.pendantAccessoryPrice(),
      },
      createdAt: dayjs().toISOString(),
    };

    this.shoppingCartService.addToCart(crystal.id, cartItem);
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

  onGoBack() {
    this.location.back();
  }

  openMandatoryCrystalAccessoryDialog() {
    const crystal = this.crystal();
    if (isNil(crystal)) {
      return;
    }

    const dialogRef = this.matDialog.open(CrystalAccessoryDialogComponent, {
      minWidth: '300px',
      width: '80%',
      minHeight: '80vh',
      data: {
        showSelections: crystal.mandatoryTypes,
        discount: crystal.mandatoryDiscount || 0,
        selectedAccessories: this.mandatorySelectedAccessories(),
        singleSelect: Object.values(CrystalMythicalBeastType).some((data) =>
          crystal?.mandatoryTypes.includes(data),
        ),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.type === 'confirm') {
        this.mandatorySelectedAccessories.set(result.accessories);
        this.mandatoryAccessoryPrice.set(result.discountPrice);
        this.mandatoryOriginalAccessoryPrice.set(result.originalPrice);
        this.mandatoryPriceText.set(result.showDiscountPriceText);
      }
    });
  }

  openOptionalCrystalAccessoryDialog() {
    const crystal = this.crystal();
    if (isNil(crystal)) {
      return;
    }

    const dialogRef = this.matDialog.open(CrystalAccessoryDialogComponent, {
      minWidth: '300px',
      width: '80%',
      minHeight: '80vh',
      data: {
        showSelections: crystal.optionalTypes,
        discount: 0,
        selectedAccessories: this.optionalSelectedAccessories(),
        singleSelect: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.type === 'confirm') {
        this.optionalSelectedAccessories.set(result.accessories);
        this.optionalAccessoryPrice.set(result.discountPrice);
        this.optionalOriginalAccessoryPrice.set(result.originalPrice);
        this.optionalPriceText.set(result.showDiscountPriceText);
      }
    });
  }

  openPendantCrystalAccessoryDialog() {
    const crystal = this.crystal();
    if (isNil(crystal)) {
      return;
    }

    const dialogRef = this.matDialog.open(CrystalAccessoryDialogComponent, {
      minWidth: '300px',
      width: '80%',
      minHeight: '80vh',
      data: {
        showSelections: crystal.pendantTypes,
        discount: crystal.pendantDiscount,
        selectedAccessories: this.pendantSelectedAccessories(),
        hasWorkFee: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.type === 'confirm') {
        this.pendantSelectedAccessories.set(result.accessories);
        this.pendantAccessoryPrice.set(result.discountPrice);
        this.pendantOriginalAccessoryPrice.set(result.originalPrice);
        this.pendantPriceText.set(result.showDiscountPriceText);
      }
    });
  }

  reset() {
    this.mandatorySelectedAccessories.set([]);
    this.optionalSelectedAccessories.set([]);
    this.pendantSelectedAccessories.set([]);
    this.mandatoryAccessoryPrice.set(0);
    this.optionalAccessoryPrice.set(0);
    this.pendantAccessoryPrice.set(0);
    this.mandatoryOriginalAccessoryPrice.set(0);
    this.optionalOriginalAccessoryPrice.set(0);
    this.pendantOriginalAccessoryPrice.set(0);
    this.mandatoryPriceText.set('');
    this.optionalPriceText.set('');
    this.pendantPriceText.set('');
    this.crystalQuantity.set(1);
    this.showMandatoryError.set(false);
  }
}
