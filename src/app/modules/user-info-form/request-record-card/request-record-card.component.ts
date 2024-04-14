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
      <div class="flex w-full h-full items-center justify-center">
        <div class="min-w-[70%] max-w-[80%] rounded m-4 overflow-hidden">
          <div
            [class]="
              twMerge(
                'flex items-center justify-between w-full p-2 text-white',
                this.bgColor
              )
            "
          >
            <div>{{ record.id }}</div>
            <div class=" italic">
              {{ record.created | date: 'yyyy/MM/dd' }}
            </div>
          </div>
          <div class="border bg-[#f8f6f3] p-2 w-full">
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
            <app-divider textStyles="bg-[#f8f6f3]">收件人資訊</app-divider>
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
          <div
            [class]="
              twMerge(
                'flex items-center justify-end w-full p-2 text-white font-bold',
                this.bgColor
              )
            "
          >
            @switch (record.status) {
              @case ('init') {
                未確認
              }
              @case ('confirmed') {
                已確認
              }
              @case ('rejected') {
                拒絕
              }
              @default {
                未確認
              }
            }
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
    switch (this.record?.status) {
      case 'init':
        return 'bg-blue-400';
      case 'confirmed':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-blue-400';
    }
  }
}
