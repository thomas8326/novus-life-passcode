import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { GenderMap } from 'src/app/enums/gender.enum';
import { RequestRecord } from 'src/app/models/account';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-request-record-card',
  standalone: true,
  imports: [DividerComponent, DatePipe, FirebaseImgUrlDirective],
  template: `
    @let recordData = record();
    @if (recordData) {
      <div
        class="w-full h-full rounded overflow-hidden text-[14px] sm:text-[16px]"
      >
        <div class="p-4 w-full">
          <div class="flex gap-1">
            <div class="font-bold">姓名:</div>
            <div>{{ recordData.basicInfo.name }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">職業:</div>
            <div>{{ recordData.basicInfo.jobOccupation }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">性別:</div>
            <div>{{ GenderMap[recordData.basicInfo.gender] }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">生日:</div>
            <div>{{ recordData.basicInfo.birthday | date: 'yyyy/MM/dd' }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">身分證後九碼:</div>
            <div>{{ recordData.basicInfo.nationalID }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">信箱:</div>
            <div>
              {{
                recordData.basicInfo.email ? recordData.basicInfo.email : '無'
              }}
            </div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">困難/心願:</div>
            <div>{{ recordData.basicInfo.wanting }}</div>
          </div>

          @if (recordData.basicInfo.wantsBox) {
            <div class="flex gap-1 items-center">
              <div>加購水晶寶盒</div>
            </div>
          }
          @if (recordData.basicInfo.hasBracelet) {
            <div class="flex gap-1 items-center">
              <a
                appFirebaseImgUrl
                [imgHref]="recordData.basicInfo.braceletImage"
                class="text-blue-600"
                target="_blank"
                >顯示水晶圖示</a
              >
            </div>
          }
          <app-divider textStyles="px-2">收件人資訊</app-divider>
          <div class="flex gap-1">
            <div class="font-bold">姓名:</div>
            <div>{{ recordData.remittance.name }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">電話:</div>
            <div>{{ recordData.remittance.phone }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">地址:</div>
            <div>{{ recordData.remittance.delivery.address }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">末五碼:</div>
            <div>{{ recordData.remittance.bank.account }}</div>
          </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class RequestRecordCardComponent {
  record = input<RequestRecord | null>(null);
  GenderMap = GenderMap;

  twMerge = twMerge;
}
