import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { RemittanceStateType } from 'src/app/models/account';
import {
  CartFeedback,
  CartFeedbackState,
  CartRecord,
} from 'src/app/models/cart';
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
export class CrystalRequestsComponent {
  cartRecords: CartRecord[] = [];
  private userId: string | null = null;

  CartRemittanceState = RemittanceStateType;
  CartCompanyFeedbackState = CartFeedbackState;

  stateMap = {
    0: '尚未確認',
    1: '正在確認訂單',
    2: '出貨中/完成訂單',
    3: '拒絕訂單',
  };

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly account: AccountService,
    private readonly notifyService: NotifyService,
  ) {}

  ngOnInit(): void {
    const userId = this.activatedRoute.parent?.snapshot.paramMap.get('id');

    if (userId) {
      this.userId = userId;
      this.shoppingCartService
        .getCartRecords(userId)
        .subscribe((cartRecords) => {
          this.cartRecords = cartRecords;
        });

      this.notifyService.readNotify('cart', 'system', userId);
    }
  }

  onSave(form: NgForm, record: CartRecord) {
    if (form.valid && this.userId) {
      const feedback = { ...form.value, createdAt: dayjs().toISOString() };
      const feedbackRecord: CartFeedback = {
        ...feedback,
        updatedBy: this.account.getMyAccount()?.name,
      };

      const cartFeedback: Partial<CartRecord> = {
        feedback,
        feedbackRecords: [...record.feedbackRecords, feedbackRecord],
      };

      this.shoppingCartService.updateCartRecord(
        this.userId,
        record.recordId,
        cartFeedback,
      );

      this.notifyService.updateNotify('cart', 'system', this.userId);
    }
  }
}
