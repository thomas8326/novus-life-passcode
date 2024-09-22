import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { isNil } from 'src/app/common/utilities';
import { RemittanceInformationComponent } from 'src/app/components/remittance-information/remittance-information.component';
import { Gender } from 'src/app/enums/gender.enum';
import { BasicInfo, Remittance } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';
import { WearerInformationComponent } from '../wearer-information/wearer-information.component';

const DEFAULT_REMITTANCE: Remittance = {
  name: '',
  phone: '',
  email: '',
  paymentType: 'normal',
  delivery: {
    address: '',
  },
  bank: {
    name: '',
    account: '',
    code: '',
  },
};

const DEFAULT_BASIC_INFO: BasicInfo = {
  name: '',
  birthday: '',
  gender: Gender.Female,
  nationalID: '',
  email: '',
};
@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RemittanceInformationComponent,
    WearerInformationComponent,
  ],
  template: `
    <div class="flex flex-col w-full h-full px-2 py-4">
      <div class="flex-1">
        <div class="flex flex-col w-full h-full gap-2 items-center">
          <form
            [formGroup]="form"
            class="bg-white shadow-md rounded-lg overflow-hidden w-full"
          >
            <div class="bg-blue-50 px-6 py-4">
              <h2 class="text-2xl font-bold text-blue-800">帳號設置</h2>
            </div>
            <div class="px-6 py-4">
              <div class="mb-6 relative">
                <label
                  for="accountName"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  帳號名稱
                </label>
                <input
                  type="text"
                  id="accountName"
                  name="accountName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="輸入帳號名稱"
                  formControlName="name"
                />
                @if (
                  form.controls.name.hasError('required') &&
                  form.controls.name.touched
                ) {
                  <mat-error class="absolute text-xs"
                    >帳號名稱為必填項</mat-error
                  >
                }
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  />
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  />
                </svg>
                <span>{{ account().email }}</span>
              </div>
            </div>
            <div class="bg-gray-50 px-6 py-4">
              <button
                type="button"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                (click)="onUpdateAccount()"
              >
                更新
              </button>
            </div>
          </form>

          @if (!hideRemittance()) {
            <div class="bg-white shadow-md rounded-lg overflow-hidden w-full">
              <div class="bg-blue-50 px-6 py-4">
                <h2 class="text-2xl font-bold text-blue-800">收件人資訊</h2>
              </div>

              <div class="m-4 flex space-x-2">
                @for (remittance of remittances(); track $index) {
                  <button
                    class="flex items-center justify-center w-10 h-10  rounded cursor-pointer"
                    [ngClass]="
                      remittancePage() === $index
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    "
                    (click)="onRemittancePageChange($index)"
                  >
                    <span>{{ $index + 1 }}</span>
                  </button>
                }
              </div>
              <app-remittance-information
                [touched]="remittanceTouched()"
                [remittance]="remittances()[remittancePage()]"
                [hidePaymentType]="true"
                [hideDelivery]="true"
                [hideTitle]="true"
                [styles]="{ container: 'rounded-none' }"
                (remittanceFormChange)="onRemittanceFormChange($event)"
              />
              <div class="bg-gray-50 px-6 py-4">
                <button
                  type="button"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  (click)="onRemittanceFormSubmit()"
                >
                  更新
                </button>
              </div>
            </div>
          }

          @if (!hideBasicInfo()) {
            <div class="bg-white shadow-md rounded-lg overflow-hidden w-full">
              <div class="bg-blue-50 px-6 py-4">
                <h2 class="text-2xl font-bold text-blue-800">基本資訊</h2>
              </div>

              <div class="m-4 flex space-x-2">
                @for (info of basicInfos(); track $index) {
                  <button
                    class="flex items-center justify-center w-10 h-10  rounded cursor-pointer"
                    [ngClass]="
                      basicInfoPage() === $index
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    "
                    (click)="onBasicInfoPageChange($index)"
                  >
                    <span>{{ $index + 1 }}</span>
                  </button>
                }
              </div>

              <app-wearer-information
                [touched]="basicInfoTouched()"
                [basicInfo]="basicInfos()[basicInfoPage()]"
                [styles]="{ container: 'rounded-none' }"
                [hideImageUpload]="true"
                [hideBracelet]="true"
                [hideWristSize]="true"
                [hideTitle]="true"
                (wearerFormChange)="onBasicInfoFormChange($event)"
              />
              <div class="bg-gray-50 px-6 py-4">
                <button
                  type="button"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  (click)="onBasicInfoFormSubmit()"
                >
                  更新
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;
    }
  `,
})
export class UpdateAccountComponent {
  MAX_COUNT = 3;

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  account = input<{ uid: string; email: string }>({ uid: '', email: '' });
  hideBasicInfo = input(false);
  hideRemittance = input(false);

  afterUpdated = output<void>();

  remittanceTouched = signal(false);
  remittancePage = signal(0);
  remittances = signal<Remittance[]>([]);
  remittanceForm = signal<{ data: Remittance | null; valid: boolean }>({
    data: null,
    valid: false,
  });

  basicInfoTouched = signal(false);
  basicInfoPage = signal(0);
  basicInfos = signal<BasicInfo[]>([]);
  basicInfoForm = signal<{ data: BasicInfo | null; valid: boolean }>({
    data: null,
    valid: false,
  });

  form = this.fb.group({
    name: ['', Validators.required],
  });

  constructor() {
    effect(
      () => {
        const myAccount = this.accountService.myAccount();

        if (isNil(myAccount)) {
          return;
        }

        this.form.patchValue({
          name: myAccount.name,
        });

        const getArray = (data: any[], defaultData: any) => {
          if (data.length < 3) {
            const additionalRemittances = Array(3 - data.length).fill(
              defaultData,
            );
            return [...data, ...additionalRemittances];
          }
          return data;
        };

        this.remittances.set(
          getArray(myAccount.remittances || [], DEFAULT_REMITTANCE),
        );
        this.basicInfos.set(
          getArray(myAccount.basicInfos || [], DEFAULT_BASIC_INFO),
        );
      },
      { allowSignalWrites: true },
    );
  }

  onRemittancePageChange(index: number) {
    this.remittancePage.set(index);
    this.remittanceTouched.set(false);
  }

  onRemittanceFormChange(response: {
    data: Remittance | null;
    valid: boolean;
  }) {
    this.remittanceForm.set(response);
  }

  onRemittanceFormSubmit() {
    this.remittanceTouched.set(true);
    console.log(this.remittanceForm());
    if (this.remittanceForm().valid) {
      const remittances = this.remittanceForm().data!;
      this.accountService.updateRemittances(remittances, this.remittancePage());
    }
  }

  onBasicInfoPageChange(index: number) {
    this.basicInfoPage.set(index);
    this.basicInfoTouched.set(false);
  }

  onBasicInfoFormChange(response: { data: BasicInfo | null; valid: boolean }) {
    this.basicInfoForm.set(response);
  }

  onBasicInfoFormSubmit() {
    if (!this.basicInfoForm().valid) {
      this.basicInfoTouched.set(true);
      return;
    }

    const updatedBasicInfos = this.basicInfos().map((info, index) =>
      index === this.basicInfoPage()
        ? { ...info, ...this.basicInfoForm().data }
        : info,
    );
    this.accountService.updateBasicInfos(updatedBasicInfos);
  }

  onUpdateAccount() {
    const uid = this.accountService.myAccount()?.uid;

    if (isNil(uid) || this.form.invalid) {
      return;
    }

    this.accountService
      .updateUserAccount(uid, {
        name: this.form.controls.name.value!,
      })
      .then(() => this.afterUpdated.emit());
  }
}
