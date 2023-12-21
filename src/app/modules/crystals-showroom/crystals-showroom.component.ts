import { Component } from '@angular/core';
import { LifeType } from 'src/app/consts/life-type';

@Component({
  selector: 'app-crystals-showroom',
  standalone: true,
  imports: [],
  templateUrl: './crystals-showroom.component.html',
})
export class CrystalsShowroomComponent {
  type: LifeType = LifeType.Life;
}
