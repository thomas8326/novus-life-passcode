import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  Recipient,
  RecipientService,
} from 'src/app/services/updates/recipient.service';

@Component({
  selector: 'app-recipient-information',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div
      class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6"
      role="alert"
    >
      @if (type === 'goToPage') {
        <p class="flex flex-wrap">
          匯款資訊會顯示在<span class="flex whitespace-nowrap"
            >「我的帳戶
            <mat-icon class="mx-2 text-gray-600">account_circle</mat-icon
            >」</span
          >
          底下的「查看推算/購買記錄」之中。
        </p>
      } @else {
        請匯款完成後，點擊「我已匯款」按鈕。
      }
    </div>

    <div class="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4">
      <h2 class="text-lg sm:text-xl font-semibold mb-4">銀行帳戶資訊</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">銀行代碼</p>
          <p class="font-medium">{{ this.recipient?.bankCode }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">銀行名稱</p>
          <p class="font-medium">{{ this.recipient?.bankName }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">戶名</p>
          <p class="font-medium">{{ this.recipient?.owner }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">帳號</p>
          <p class="font-medium">{{ this.recipient?.account }}</p>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class RecipientInformationComponent {
  @Input() type: 'goToPage' | 'clickBtn' = 'clickBtn';

  recipient: Recipient | null = null;

  constructor(private readonly recipientService: RecipientService) {
    this.recipientService.listenRecipient((data) => (this.recipient = data));
  }
}
