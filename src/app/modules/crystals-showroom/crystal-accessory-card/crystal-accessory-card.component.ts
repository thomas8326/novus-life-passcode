import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';

@Component({
  selector: 'app-crystal-accessory-card',
  standalone: true,
  imports: [
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    FirebaseImgUrlDirective,
    DividerComponent,
  ],
  templateUrl: './crystal-accessory-card.component.html',
  styles: ``,
})
export class CrystalAccessoryCardComponent {
  @Input() crystalAccessory: CrystalAccessory | null = null;

  constructor() {}
}
