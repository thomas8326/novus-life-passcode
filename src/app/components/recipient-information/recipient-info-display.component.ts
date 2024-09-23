import { Component, computed, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LINE_ID } from 'src/app/consts/app';
import {
  Recipient,
  RecipientService,
} from 'src/app/services/updates/recipient.service';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-recipient-info-display',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div
      class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 flex items-center"
      role="alert"
    >
      @if (type() === 'goToPage') {
        <p class="flex flex-wrap">
          匯款資訊會顯示在<span class="flex whitespace-nowrap"
            >「我的帳戶
            <mat-icon class="mx-2 text-gray-600">account_circle</mat-icon
            >」</span
          >
          底下的「查看推算/購買記錄」之中。
        </p>
      } @else {
        請匯款完成後，輸入該次匯款金額並按下「匯款」。
        <br />
        確認匯款後製作約 2 ~ 14 個工作天不含假日，會盡快製作完成。
      }
    </div>

    <div
      class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 flex items-center justify-between h-[72px]"
      role="alert"
    >
      <p class="text-yellow-800">有問題請聯繫小幫手</p>
      <a
        href="https://line.me/ti/p/~{{ lineId }}"
        target="_blank"
        class="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
      >
        LINE聯絡
      </a>
    </div>

    <div [class]="containerClass()">
      <h2 class="text-lg sm:text-xl font-semibold mb-4">銀行帳戶資訊</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">銀行代碼</p>
          <p class="font-medium">{{ recipient()?.bankCode }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">銀行名稱</p>
          <p class="font-medium">{{ recipient()?.bankName }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">戶名</p>
          <p class="font-medium">{{ recipient()?.owner }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">帳號</p>
          <p class="font-medium">{{ recipient()?.account }}</p>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class RecipientInfoDisplayComponent {
  type = input<'goToPage' | 'clickBtn'>('clickBtn');
  styles = input<Partial<{ container: string }>>({ container: '' });

  recipient = signal<Recipient | null>(null);

  lineId = LINE_ID;

  private recipientService = inject(RecipientService);

  containerClass = computed(() =>
    twMerge(
      'bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4',
      this.styles().container,
    ),
  );

  constructor() {
    this.recipientService.listenRecipient((data) => this.recipient.set(data));
  }
}
