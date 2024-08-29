import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { isNotNil } from 'src/app/common/utilities';
import { ImageLoaderComponent } from 'src/app/components/image-loader/image-loader.component';
import { Crystal } from 'src/app/models/crystal';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-crystal-product-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ImageLoaderComponent,
    TwCurrencyPipe,
    ImageLoaderComponent,
  ],
  template: `
    @let crystalData = crystal();
    @if (crystalData) {
      <div
        class="shadow-lg bg-white h-full flex flex-col rounded overflow-hidden cursor-pointer"
        (click)="onGoToDetail()"
      >
        @if (tempImage()) {
          <img
            [src]="tempImage()"
            alt="Product Image"
            class="aspect-[5/6] w-full"
          />
        } @else {
          <app-image-loader
            [src]="crystalData.image_url"
            alt="Product Image"
            class="aspect-[5/6] w-full"
          />
        }

        <div class="relative flex items-center justify-center w-full">
          <hr class="w-full border-[#d7e9f2]" />
          <div
            class="absolute rounded-full overflow-hidden w-8 h-8 bg-[url('/assets/logo/novus.jpg')] bg-no-repeat bg-center bg-contain border-2 border-[#c0deed] -translate-y-1"
          ></div>
        </div>
        <div
          class="font-bold text-[16px] sm:text-desktopSubTitle pt-3 px-1 pb-2"
        >
          {{ crystalData.name }}
        </div>
        @if (hasDescriptions()) {
          <hr />
          <div class="py-2 px-1 flex-1">
            <span class="font-bold">生命密碼手鍊：</span>
            <ul class="ml-2">
              @for (description of crystalData.descriptions; track $index) {
                <li>{{ description }}</li>
              }
            </ul>
          </div>
        }
        @if (hasEmphasizes()) {
          <hr />
          <div class="py-2 px-1">
            <ul class="ml-2">
              @for (emphasize of crystalData.emphasizes; track $index) {
                <li>{{ emphasize }}</li>
              }
            </ul>
          </div>
        }
        <hr />
        <div class="flex items-center justify-end px-4 py-2">
          <div class="font-bold">{{ crystalData.price | twCurrency }}</div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class CrystalProductCardComponent {
  tempImage = input<string | null>(null);
  crystalId = input('');
  crystal = input<Crystal | null>(null);
  @Output() goToDetail = new EventEmitter<string>();

  hasDescriptions = computed(() => {
    const crystalData = this.crystal();
    return isNotNil(crystalData) && crystalData.descriptions.length > 0;
  });

  hasEmphasizes = computed(() => {
    const crystalData = this.crystal();
    return isNotNil(crystalData) && crystalData.emphasizes.length > 0;
  });

  onGoToDetail() {
    this.goToDetail.emit(this.crystalId());
  }
}
