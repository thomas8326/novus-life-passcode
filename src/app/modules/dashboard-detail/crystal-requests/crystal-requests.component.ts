import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { RemittanceStateType } from 'src/app/models/account';
import { CartFeedbackState, CartRecord } from 'src/app/models/cart';
import { MobileCartItemComponent } from 'src/app/modules/shopping-cart/accessory-cart-item/mobile-cart-item.component';
import { SortByPipe } from 'src/app/pipes/sortBy.pipe';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { AccountService } from 'src/app/services/account/account.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-crystal-requests',
  standalone: true,
  imports: [
    MobileCartItemComponent,
    DividerComponent,
    DatePipe,
    CommonModule,
    AsyncPipe,
    FormsModule,
    SortByPipe,
    MatButtonToggleModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TwCurrencyPipe,
  ],
  templateUrl: './crystal-requests.component.html',
  styles: ``,
})
export class CrystalRequestsComponent implements OnInit {
  cartRecords = signal<CartRecord[]>([]);
  userId = signal<string | null>(null);

  CartRemittanceState = RemittanceStateType;
  CartCompanyFeedbackState = CartFeedbackState;

  stateMap = {
    0: '尚未確認',
    1: '正在確認訂單',
    2: '出貨中/完成訂單',
    3: '拒絕訂單',
  };

  sortedRequestRecords = computed(() =>
    [...this.cartRecords()].sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
    ),
  );

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly account: AccountService,
    private readonly notifyService: NotifyService,
  ) {}

  ngOnInit(): void {
    const userId = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (userId) {
      this.userId.set(userId);
      this.loadCartRecords(userId);
      this.notifyService.readNotify('cart', 'system', userId);
    }
  }

  loadCartRecords(userId: string): void {
    this.shoppingCartService.getCartRecords(userId).subscribe((cartRecords) => {
      this.cartRecords.set(cartRecords);
    });
  }

  onSave(form: NgForm, record: CartRecord): void {
    if (form.valid && this.userId()) {
      this.shoppingCartService
        .updateCartRecord(this.userId()!, record.recordId, record)
        .then(() => {
          this.notifyService.updateNotify('cart', 'system', this.userId()!);
        });
    }
  }

  updateRecord(recordId: string, updates: Partial<CartRecord>) {
    this.cartRecords.update((records) =>
      records.map((record) =>
        record?.recordId === recordId ? { ...record, ...updates } : record,
      ),
    );
  }

  updateFeedbackState(record: CartRecord, state: CartFeedbackState) {
    this.updateRecord(record.recordId, {
      feedback: {
        ...record.feedback,
        state,
      },
    });
  }

  updateFeedbackReason(record: CartRecord, reason: string) {
    this.updateRecord(record.recordId, {
      feedback: {
        ...record.feedback,
        reason,
        createdAt: dayjs().toISOString(),
      },
    });
  }
}
