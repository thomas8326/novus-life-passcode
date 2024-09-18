import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-red-600">刪除帳號</h1>
      <div
        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
        role="alert"
      >
        <p class="font-bold">警告</p>
        <p>刪除帳號是不可逆的操作。所有與您帳號相關的數據都將被永久刪除。</p>
      </div>
      <form [formGroup]="deleteForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label
            for="confirmText"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            請輸入「確認刪除本帳號」以確認：
          </label>
          <input
            type="text"
            id="confirmText"
            formControlName="confirmText"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="確認刪除本帳號"
          />
          <p
            *ngIf="
              deleteForm.get('confirmText')?.invalid &&
              (deleteForm.get('confirmText')?.dirty ||
                deleteForm.get('confirmText')?.touched)
            "
            class="mt-2 text-sm text-red-600"
          >
            請輸入正確的確認文字。
          </p>
        </div>
        <div>
          <button
            type="submit"
            [disabled]="deleteForm.invalid"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            刪除我的帳號
          </button>
        </div>
      </form>
    </div>
  `,
})
export class DeleteAccountComponent implements OnInit {
  deleteForm: FormGroup;
  private readonly CONFIRMATION_TEXT = '確認刪除本帳號';

  constructor(private fb: FormBuilder) {
    this.deleteForm = this.fb.group({
      confirmText: [
        '',
        [Validators.required, Validators.pattern(this.CONFIRMATION_TEXT)],
      ],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.deleteForm.valid) {
      // 這裡實現實際的帳號刪除邏輯
      console.log('帳號刪除請求已提交');
      // 例如：調用API來刪除帳號
      // this.accountService.deleteAccount().subscribe(
      //   () => {
      //     console.log('帳號已成功刪除');
      //     // 重定向到登出頁面或首頁
      //   },
      //   (error) => {
      //     console.error('刪除帳號時發生錯誤', error);
      //     // 顯示錯誤消息給用戶
      //   }
      // );
    }
  }
}
