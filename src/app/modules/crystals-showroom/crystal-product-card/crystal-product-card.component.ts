import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { Crystal } from 'src/app/models/crystal';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';

@Component({
  selector: 'app-crystal-product-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FirebaseImgUrlDirective,
    TwCurrencyPipe,
  ],
  templateUrl: './crystal-product-card.component.html',
  styles: ``,
})
export class CrystalProductCardComponent {
  @Input() tempImage: string | null = null;
  @Input() crystalId: string = '';
  @Input() crystal: Crystal | null = null;
  @Output() goToDetail = new EventEmitter<string>();

  onGoToDetail() {
    this.goToDetail.emit(this.crystalId);
  }
}
