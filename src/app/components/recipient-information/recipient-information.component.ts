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
    <div class="rounded-md bg-white my-3 px-2 py-4">
      銀行代碼：{{ this.recipient?.bankCode }}<br />
      銀行名稱：{{ this.recipient?.bankName }}<br />
      戶名：{{ this.recipient?.owner }}<br />
      帳號：{{ this.recipient?.account }}
    </div>
    <div class="rounded-md bg-white my-3 px-2 py-4">
      @if (type === 'goToPage') {
        <span class="flex whitespace-nowrap"
          >匯款資訊會顯示我的帳戶
          <mat-icon class="mx-2 text-gray-200">account_circle</mat-icon
          >底下的「查看推算/購買記錄」之中。
        </span>
      } @else {
        請匯款完成後，點擊「我已匯款」按鈕。
      }
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
