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
        <div class="p-2 w-full">
          <div class="flex gap-1">
            <div class="font-bold">姓名：</div>
            <div>{{ record.basicInfo.name }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">性別：</div>
            <div>{{ GenderMap[record.basicInfo.gender] }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">生日：</div>
            <div>{{ record.basicInfo.birthday | date: 'yyyy/MM/dd' }}</div>
          </div>

          <div class="flex gap-1">
            <div class="font-bold">身分證後九碼：</div>
            <div>{{ record.basicInfo.nationalID }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">信箱：</div>
            <div>
              {{ record.basicInfo.email ? record.basicInfo.email : '無' }}
            </div>
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
            <div class="font-bold">姓名：</div>
            <div>{{ record.receiptInfo.name }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">電話：</div>
            <div>{{ record.receiptInfo.phone }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">地址：</div>
            <div>{{ record.receiptInfo.address }}</div>
          </div>
          <div class="flex gap-1">
            <div class="font-bold">末五碼：</div>
            <div>{{ record.receiptInfo.fiveDigits }}</div>
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

  get bgColor() {
    return '';
    // switch (this.record?.status) {
    //   case 'init':
    //     return 'bg-blue-400';
    //   case 'confirmed':
    //     return 'bg-green-500';
    //   case 'rejected':
    //     return 'bg-red-500';
    //   case 'pending':
    //     return 'bg-yellow-500';
    //   default:
    //     return 'bg-blue-400';
    // }
  }
}
