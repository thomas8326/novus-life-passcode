import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RemittanceService } from 'src/app/services/updates/remittance.service';

@Component({
  selector: 'app-update-remittance',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './update-remittance.component.html',
  styles: ``,
})
export class UpdateRemittanceComponent {
  remittanceAccount = '1234567890';
  calculationRequestPrice = 0;
  bankCode = '';

  constructor(private readonly remittanceService: RemittanceService) {
    this.remittanceService.listenRemittance((data) => {
      const { account, calculationRequestPrice, bankCode } = data;

      this.remittanceAccount = account;
      this.calculationRequestPrice = calculationRequestPrice;
      this.bankCode = bankCode;
    });
  }

  updateAccount() {
    this.remittanceService.updateAccount(this.remittanceAccount);
  }

  updatePrice() {
    this.remittanceService.updateRequestPrice(
      Number(this.calculationRequestPrice),
    );
  }
  updateBankCode() {
    this.remittanceService.updateBankCode(this.bankCode);
  }
}
