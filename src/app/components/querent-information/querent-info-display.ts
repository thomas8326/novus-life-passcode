import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { GenderMap } from 'src/app/enums/gender.enum';
import { Querent } from 'src/app/models/account';

@Component({
  selector: 'app-querent-info-display',
  standalone: true,
  imports: [DatePipe, FirebaseImgUrlDirective],
  template: `
    <div class="font-bold">問事者</div>
    <div class="ml-4">
      <div class="flex gap-1">
        <div>姓名:</div>
        <div>{{ querent().name }}</div>
      </div>

      <div class="flex gap-1">
        <div>職業:</div>
        <div>{{ querent().jobOccupation }}</div>
      </div>

      <div class="flex gap-1">
        <div>性別:</div>
        <div>{{ GenderMap[querent().gender] }}</div>
      </div>

      <div class="flex gap-1">
        <div>生日:</div>
        <div>{{ querent().birthday | date: 'yyyy/MM/dd' }}</div>
      </div>

      <div class="flex gap-1">
        <div>身分證後九碼:</div>
        <div>{{ querent().nationalID }}</div>
      </div>
      <div class="flex gap-1">
        <div>信箱:</div>
        <div>
          {{ querent().email || '無' }}
        </div>
      </div>

      <div class="flex gap-1">
        <div>困難/心願:</div>
        <div>{{ querent().wanting }}</div>
      </div>
    </div>
  `,
  styles: ``,
})
export class QuerentInfoDisplayComponent {
  querent = input.required<NonNullable<Querent>>();

  GenderMap = GenderMap;
}
