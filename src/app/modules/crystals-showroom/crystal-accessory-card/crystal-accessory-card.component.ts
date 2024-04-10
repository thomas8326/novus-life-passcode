import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';

@Component({
  selector: 'app-crystal-accessory-card',
  standalone: true,
  imports: [
    MatButtonModule,
    AsyncPipe,
    FirebaseImgUrlDirective,
    DividerComponent,
  ],
  templateUrl: './crystal-accessory-card.component.html',
  styles: ``,
})
export class CrystalAccessoryCardComponent {
  @Input() tempImage: string | null = null;
  @Input() crystalAccessory: CrystalAccessory | null = null;

  constructor() {}
}
