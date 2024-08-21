import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-crystal-accessory-card',
  standalone: true,
  imports: [
    MatButtonModule,
    AsyncPipe,
    FirebaseImgUrlDirective,
    DividerComponent,
    TwCurrencyPipe,
  ],
  templateUrl: './crystal-accessory-card.component.html',
  styles: ``,
})
export class CrystalAccessoryCardComponent {
  tempImage = input<string | null>(null);
  crystalAccessory = input<CrystalAccessory | null>(null);

  constructor() {}
}
