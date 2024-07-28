// store-selector.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Delivery } from 'src/app/models/delivery';
import { AccountService } from 'src/app/services/account/account.service';
import { v4 } from 'uuid';

@Component({
  selector: 'app-store-selector',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './store-selector.component.html',
})
export class StoreSelectorComponent {
  @Input('touched') set setTouched(touched: boolean) {
    if (touched) {
      this.formGroup.markAllAsTouched();
    }
  }
  @Output() deliveryChange = new EventEmitter<Delivery>();

  formGroup = this.fb.group({
    storeName: ['', Validators.required],
    address: ['', Validators.required],
  });

  selectedStore: { name: string; id: string } | null = null;

  constructor(
    private readonly account: AccountService,
    private readonly fb: FormBuilder,
  ) {
    this.formGroup.valueChanges.subscribe((value) => {
      if (this.formGroup.invalid) {
        return;
      }

      const delivery: Delivery = {
        storeName: this.formGroup.controls.storeName.value || '',
        address: this.formGroup.controls.address.value || '',
        temp: false,
        zipCode: '',
        storeId: v4(),
      };

      this.deliveryChange.emit(delivery);
    });
  }

  openStoreSelector() {
    const uid = this.account.getMyAccount()?.uid;
    if (!uid) {
      return;
    }

    const eshopid = '870'; // 您的 eshopid
    const servicetype = '1';
    const callbackUrl = encodeURIComponent(
      `https://us-central1-lifepasscode-671d3.cloudfunctions.net/get7ElevenStores` +
        '#callback',
    );
    const mapUrl = `https://emap.presco.com.tw/c2cemap.ashx?eshopid=${eshopid}&servicetype=${servicetype}&TempVar=${uid}&url=${callbackUrl}`;

    window.open(mapUrl, 'CVSMap', 'width=800,height=600');
  }
}
