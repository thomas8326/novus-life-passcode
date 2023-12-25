import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { LifeType } from 'src/app/consts/life-type';
import { CrystalProductCardComponent } from 'src/app/modules/crystals-showroom/crystal-product-card/crystal-product-card.component';
import { CrystalService } from 'src/app/services/crystal/crystal.service';

@Component({
  selector: 'app-crystals-showroom',
  standalone: true,
  imports: [CrystalProductCardComponent, AsyncPipe],
  templateUrl: './crystals-showroom.component.html',
})
export class CrystalsShowroomComponent {
  type: LifeType = LifeType.Life;
  showroom$ = this.crystalService.getCrystalShowroom();

  constructor(private readonly crystalService: CrystalService) {}
}
