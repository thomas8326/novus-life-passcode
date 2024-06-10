import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { GenderMap } from 'src/app/enums/gender.enum';
import { RequestRecord } from 'src/app/models/account';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-request-record-card',
  standalone: true,
  imports: [DividerComponent, DatePipe],
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
          <app-divider>收件人資訊</app-divider>
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
