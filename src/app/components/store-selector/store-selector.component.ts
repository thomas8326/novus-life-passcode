// store-selector.component.ts
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Database, ref, remove } from '@angular/fire/database';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { onValue } from 'firebase/database';
import { Delivery } from 'src/app/models/delivery';
import { v4 } from 'uuid';

export interface Store {
  data: {
    TempVar: string;
    outside: string;
    ship: string;
    storeaddress: string;
    storeid: string;
    storename: string;
  };
  expiresAt: number;
}

@Component({
  selector: 'app-store-selector',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './store-selector.component.html',
})
export class StoreSelectorComponent {
  private database: Database = inject(Database);
  private fb: FormBuilder = inject(FormBuilder);

  touched = input(false);
  deliveryChange = output<Delivery>();

  formGroup = this.fb.group({
    storeId: [''],
    storeName: ['', Validators.required],
    address: ['', Validators.required],
  });

  selectedStore = signal<{ name: string; id: string } | null>(null);

  constructor() {
    effect(() => {
      if (this.touched()) {
        this.formGroup.markAllAsTouched();
      }
    });

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
    const eshopid = '870';
    const servicetype = '1';
    const sessionId = v4();
    const callbackUrl = encodeURIComponent(
      `https://us-central1-lifepasscode-671d3.cloudfunctions.net/storeCallback`,
    );

    const mapUrl = `https://emap.presco.com.tw/c2cemap.ashx?eshopid=${eshopid}&servicetype=${servicetype}&TempVar=${sessionId}&url=${callbackUrl}`;

    const selectorWindow = window.open(
      mapUrl,
      'CVSMap',
      'width=800,height=600',
    );

    const path = `tempData/${sessionId}`;
    const tempDataRef = ref(this.database, path);

    const unsubscribe = onValue(tempDataRef, async (snapshot) => {
      const store = snapshot.val() as Store;
      if (store) {
        selectorWindow?.close();

        this.formGroup.patchValue({
          storeName: store.data.storename,
          address: store.data.storeaddress,
          storeId: store.data.storeid,
        });

        await remove(tempDataRef).then(() => unsubscribe());
      }
    });

    // 確保 selectorWindow 被關閉
    if (selectorWindow) {
      const checkWindowClosed = setInterval(() => {
        if (selectorWindow.closed) {
          clearInterval(checkWindowClosed);
          unsubscribe();
        }
      }, 500);
    }
  }
}
