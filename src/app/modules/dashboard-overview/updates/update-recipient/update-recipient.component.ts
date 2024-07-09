import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  remittanceAccount = '';
  calculationRequestPrice = 0;
  bankCode = '';

  recipient: Recipient = {
    account: '1234567890',
    owner: '林冠甫',
    bankCode: '700',
    bankName: '郵局',
  };

  constructor(private readonly recipientService: RecipientService) {
    this.recipientService.listenRecipient((data) => {
      const { calculationRequestPrice, ...recipient } = data;
      this.recipient = recipient;

      this.calculationRequestPrice = calculationRequestPrice || 0;
    });
  }

  updateRemittance() {
    this.recipientService.updateReceipt(this.recipient);
  }

  updatePrice() {
    this.recipientService.updateRequestPrice(
      Number(this.calculationRequestPrice),
    );
  }
}
