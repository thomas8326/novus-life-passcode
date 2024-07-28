import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
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
    @if (record) {
      <div
        class="w-full h-full rounded overflow-hidden text-[14px] lg:text-[16px]"
      >
        <div class="p-4 w-full">
          <div class="flex gap-1">
            <div class="font-bold">姓名:</div>
            <div>{{ record.basicInfo.name }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">職業:</div>
            <div>{{ record.basicInfo.jobOccupation }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">性別:</div>
            <div>{{ GenderMap[record.basicInfo.gender] }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">生日:</div>
            <div>{{ record.basicInfo.birthday | date: 'yyyy/MM/dd' }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">身分證後九碼:</div>
            <div>{{ record.basicInfo.nationalID }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">信箱:</div>
            <div>
              {{ record.basicInfo.email ? record.basicInfo.email : '無' }}
            </div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">困難/心願:</div>
            <div>{{ record.basicInfo.wanting }}</div>
          </div>

          @if (record.basicInfo.wantsBox) {
            <div class="flex gap-1 items-center">
              <div>加購水晶寶盒</div>
            </div>
          }
          @if (record.basicInfo.hasBracelet) {
            <div class="flex gap-1 items-center">
              <a
                appFirebaseImgUrl
                [imgHref]="record.basicInfo.braceletImage"
                class="text-blue-600"
                target="_blank"
                >顯示水晶圖示</a
              >
            </div>
          }
          <app-divider textStyles="px-2">收件人資訊</app-divider>
          <div class="flex gap-1">
            <div class="font-bold">姓名:</div>
            <div>{{ record.remittance.name }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">電話:</div>
            <div>{{ record.remittance.phone }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">地址:</div>
            <div>{{ record.remittance.delivery.address }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">末五碼:</div>
            <div>{{ record.remittance.bank.account }}</div>
          </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class RequestRecordCardComponent {
  @Input() record: RequestRecord | null = null;
  GenderMap = GenderMap;

  twMerge = twMerge;
}
