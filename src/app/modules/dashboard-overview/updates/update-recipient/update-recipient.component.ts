import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  Recipient,
  RecipientService,
} from 'src/app/services/updates/recipient.service';

@Component({
  selector: 'app-update-remittance',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './update-recipient.component.html',
  styles: ``,
})
export class UpdateRecipientComponent {
  remittanceAccount = signal('');
  bankCode = signal('');

  recipient = signal<Recipient>({
    account: '1234567890',
    owner: '林冠甫',
    bankCode: '700',
    bankName: '郵局',
  });

  constructor(private readonly recipientService: RecipientService) {
    this.recipientService.listenRecipient((data) => {
      const { ...recipient } = data;
      this.recipient.set(recipient);
    });
  }

  submitRemittance() {
    this.recipientService.updateReceipt(this.recipient());
  }

  updateRemittance(data: Partial<Recipient>) {
    this.recipient.update((prev) => ({ ...prev, ...data }));
  }
}
