import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { GenderMap } from 'src/app/enums/gender.enum';
import { Wearer } from 'src/app/models/account';

@Component({
  selector: 'app-wearer-info-display',
  standalone: true,
  imports: [DatePipe, FirebaseImgUrlDirective],
  template: `
    <div class="font-bold">配戴者</div>
    <div class="ml-4">
      <div class="flex gap-2">
        <div>姓名: {{ wearer().name }}</div>
        <div>性別: {{ GenderMap[wearer().gender] }}</div>
      </div>
      <div>生日: {{ wearer().birthday | date: 'yyyy/MM/dd' }}</div>
      <div>身分證字號: {{ wearer().nationalID }}</div>
      <div>電子郵件: {{ wearer().email }}</div>
      <div class="whitespace-nowrap">
        上傳手鏈照片:
        <a
          appFirebaseImgHref
          [imgHref]="wearer().braceletImage"
          class="text-blue-600 cursor-pointer"
          target="_blank"
          >顯示水晶圖示</a
        >
      </div>
    </div>
  `,
  styles: ``,
})
export class WearerInfoDisplayComponent {
  wearer = input.required<NonNullable<Wearer>>();

  GenderMap = GenderMap;
}
