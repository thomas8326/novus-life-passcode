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
import dayjs from 'dayjs';
import { isNil } from 'src/app/common/utilities';
import { BasicInfoFormComponent } from 'src/app/components/basic-info-form/basic-info-form.component';
import { ConsigneeFormComponent } from 'src/app/components/remittance-information/consignee-form.component';
import { RemittanceFormComponent } from 'src/app/components/remittance-information/remittance-form.component';
import { Gender } from 'src/app/enums/gender.enum';
import { BasicInfo, Consignee } from 'src/app/models/account';
import { FormGroupControls } from 'src/app/models/form';
import { AccountService } from 'src/app/services/account/account.service';
import {
  numericValidator,
  taiwanPhoneValidator,
} from 'src/app/validators/numberic.validators';
import { WearerFormComponent } from '../wearer-information/wearer-form.component';

const DEFAULT_CONSIGNEE: Consignee = {
  name: '',
  phone: '',
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
    RemittanceFormComponent,
    WearerFormComponent,
    BasicInfoFormComponent,
    ConsigneeFormComponent,
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
                @for (consignee of consigneeForms.controls; track $index) {
                  <button
                    class="flex items-center justify-center w-10 h-10  rounded cursor-pointer"
                    [ngClass]="
                      consigneePage() === $index
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    "
                    (click)="onRemittancePageChange($index)"
                  >
                    <span>{{ $index + 1 }}</span>
                  </button>
                }
              </div>

              <div class="p-4 sm:p-6">
                <app-consignee-form
                  [nameControl]="
                    consigneeForms.at(consigneePage()).controls.name
                  "
                  [phoneControl]="
                    consigneeForms.at(consigneePage()).controls.phone
                  "
                  [bankFormGroup]="
                    consigneeForms.at(consigneePage()).controls.bank
                  "
                ></app-consignee-form>
              </div>

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
                @for (info of basicForms.controls; track $index) {
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

              <div class="p-4 sm:p-6">
                <app-basic-info-form
                  [basicInfoForm]="basicForms.at(basicInfoPage())"
                ></app-basic-info-form>
              </div>

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

  consigneeTouched = signal(false);
  consigneePage = signal(0);
  consigneeForms = this.fb.array([
    this.fb.group(this.initConsigneeFormGroup()),
    this.fb.group(this.initConsigneeFormGroup()),
    this.fb.group(this.initConsigneeFormGroup()),
  ]);

  basicInfoTouched = signal(false);
  basicInfoPage = signal(0);
  basicForms = this.fb.array([
    this.fb.group<FormGroupControls<BasicInfo>>(this.initBasicInfoFormGroup()),
    this.fb.group<FormGroupControls<BasicInfo>>(this.initBasicInfoFormGroup()),
    this.fb.group<FormGroupControls<BasicInfo>>(this.initBasicInfoFormGroup()),
  ]);

  form = this.fb.group({
    name: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const myAccount = this.accountService.myAccount();

      if (isNil(myAccount)) {
        return;
      }

      this.form.patchValue(
        {
          name: myAccount.name,
        },
        { emitEvent: false },
      );

      const getArray = (data: any[], defaultData: any) =>
        data.length < 3 ? Array(this.MAX_COUNT).fill(defaultData) : data;

      this.consigneeForms.patchValue(
        getArray(myAccount.consignees || [], DEFAULT_CONSIGNEE),
      );
      this.basicForms.patchValue(
        getArray(myAccount.basicInfos || [], DEFAULT_BASIC_INFO),
      );

      console.log(myAccount.basicInfos);
    });
  }

  onRemittancePageChange(index: number) {
    this.consigneePage.set(index);
    this.consigneeForms.markAsUntouched();
  }

  onRemittanceFormSubmit() {
    const currentForm = this.consigneeForms.at(this.consigneePage());

    if (!currentForm.valid) {
      currentForm.markAllAsTouched();
      return;
    }

    const consignees = this.accountService.myAccount()?.consignees || [];

    if (consignees.length < 3) {
      const updatedConsignees = Array(3).fill(DEFAULT_CONSIGNEE);
      updatedConsignees[this.consigneePage()] = currentForm.getRawValue();
      this.accountService.updateConsignees(updatedConsignees);
    } else {
      consignees[this.consigneePage()] = currentForm.getRawValue();
      this.accountService.updateConsignees(consignees);
    }
  }

  onBasicInfoPageChange(index: number) {
    this.basicInfoPage.set(index);
    this.basicForms.markAsUntouched();
  }

  onBasicInfoFormSubmit() {
    const currentForm = this.basicForms.at(this.basicInfoPage());

    if (!currentForm.valid) {
      currentForm.markAllAsTouched();
      return;
    }

    const basicInfos = this.accountService.myAccount()?.basicInfos || [];
    const currentValue: BasicInfo = {
      ...currentForm.getRawValue(),
      birthday: dayjs(currentForm.controls.birthday.value).toISOString(),
    };

    if (basicInfos.length < 3) {
      const updatedBasicInfos = Array(3).fill(DEFAULT_BASIC_INFO);
      updatedBasicInfos[this.basicInfoPage()] = currentValue;
      this.accountService.updateBasicInfos(updatedBasicInfos);
    } else {
      basicInfos[this.basicInfoPage()] = currentValue;
      this.accountService.updateBasicInfos(basicInfos);
    }
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

  initBasicInfoFormGroup() {
    return {
      name: this.fb.nonNullable.control('', Validators.required),
      gender: this.fb.nonNullable.control<Gender>(
        Gender.Female,
        Validators.required,
      ),
      birthday: this.fb.nonNullable.control('', Validators.required),
      nationalID: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        numericValidator(),
      ]),
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
    };
  }

  initConsigneeFormGroup() {
    return {
      name: this.fb.nonNullable.control('', Validators.required),
      phone: this.fb.nonNullable.control('', [
        Validators.required,
        numericValidator(),
        taiwanPhoneValidator(),
      ]),
      bank: this.fb.nonNullable.group({
        code: ['', Validators.required],
        name: ['', Validators.required],
        account: ['', [Validators.required, Validators.minLength(5)]],
      }),
    };
  }
}
