import { Component, OnDestroy, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { isNotNil } from 'src/app/common/utilities';
import { ContactUsLinksComponent } from 'src/app/components/contact-us-links/contact-us-links.component';
import { RecipientInformationComponent } from 'src/app/components/recipient-information/recipient-information.component';
import { LINE_ID } from 'src/app/consts/app';
import { ForceLoginDirective } from 'src/app/directives/force-login.directive';
import { Gender } from 'src/app/enums/gender.enum';
import { MyBasicInfo, Remittance } from 'src/app/models/account';
import { FileSizePipe } from 'src/app/pipes/fileSize.pipe';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';
import { Prices, PricesService } from 'src/app/services/updates/prices.service';
import {
  CleanFlow,
  FAQ,
  UserFormService,
} from 'src/app/services/updates/user-form.service';
import {
  numericValidator,
  taiwanPhoneValidator,
} from 'src/app/validators/numberic.validators';
import { BankSelectorComponent } from '../../components/bank-selector/bank-selector.component';
import {
  Recipient,
  RecipientService,
} from '../../services/updates/recipient.service';

enum Step {
  Introduction,
  BasicInfo,
  Tutorial,
  Receipt,
  ContactUs,
  FAQ,
}

@Component({
  selector: 'app-user-info-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileSizePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ContactUsLinksComponent,
    MatExpansionModule,
    ForceLoginDirective,
    TwCurrencyPipe,
    RouterLink,
    RecipientInformationComponent,
    BankSelectorComponent,
  ],
  templateUrl: './user-info-form.component.html',
  styles: `
    :host {
      --mdc-filled-text-field-container-color: #f0e4ce;
    }
  `,
})
export class UserInfoFormComponent implements OnDestroy {
  userStep = signal(Step.Introduction);
  Step = Step;
  Gender = Gender;
  lineId = LINE_ID;
  orderId = '';
  isCopied = false;

  customerForm = this.fb.group({
    name: ['', Validators.required],
    birthday: ['', Validators.required],
    gender: [Gender.Female, Validators.required],
    wristSize: [''],
    nationalID: [
      '',
      [Validators.required, Validators.minLength(9), numericValidator()],
    ],
    email: ['', [Validators.required, Validators.email]],
    hasBracelet: [false],
    wantsBox: [false],
    braceletImage: [''],
    jobOccupation: [''],
    wanting: [''],
  });

  remittanceForm = this.fb.group({
    name: ['', Validators.required],
    phone: [
      '',
      [Validators.required, numericValidator(), taiwanPhoneValidator()],
    ],
    delivery: this.fb.group({
      address: ['', Validators.required],
    }),
    bank: this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      account: [
        '',
        [Validators.required, Validators.minLength(5), numericValidator()],
      ],
    }),
  });

  cleanFlow: CleanFlow | null = null;
  introduction = '';
  recipient: Recipient | null = null;
  faqs: [string, FAQ][] = [];
  tempImage: {
    src: string;
    file: File;
  } | null = null;
  _5MB = 5 * 1024 * 1024;
  errorMsg = '';
  loading = false;
  prices: Prices | null = null;

  constructor(
    private fb: FormBuilder,
    private userForm: UserFormService,
    private recipientService: RecipientService,
    private pricesService: PricesService,
    private request: CalculationRequestService,
    private router: Router,
  ) {
    this.userForm.listenCleanFlow((flow) => (this.cleanFlow = flow));
    this.userForm.listenIntroduction(
      (introduction) => (this.introduction = introduction),
    );
    this.userForm.listenFAQs((faqs) => (this.faqs = Object.entries(faqs)));
    this.recipientService.listenRecipient((data) => (this.recipient = data));
    this.pricesService.listenPrices((prices) => (this.prices = prices));
  }

  onFileChange(fileList: FileList | null) {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempImage = {
          src: e.target.result,
          file,
        };
      };
      reader.readAsDataURL(file);
    }
  }

  goPage(page: number) {
    if (page < 0) {
      this.userStep.update((prev) => prev + page);
      return;
    }

    switch (this.userStep()) {
      case Step.BasicInfo: {
        this.customerForm.markAllAsTouched();
        if (this.customerForm.invalid) return;
        if (isNotNil(this.tempImage) && this.tempImage.file.size > this._5MB)
          return;
        this.userStep.update((prev) => prev + page);
        break;
      }
      case Step.Receipt: {
        this.remittanceForm.markAllAsTouched();
        if (this.remittanceForm.invalid) return;
        this.loading = true;
        const basicInfo = {
          ...this.customerForm.value,
          birthday: new Date(
            this.customerForm.value.birthday || '',
          ).toISOString(),
          wristSize: Number(this.customerForm.value.wristSize || 0),
        } as MyBasicInfo;
        const remittance = this.remittanceForm.value as Remittance;
        const uploadCallback = () =>
          this.tempImage
            ? this.request.uploadRequestImage(this.tempImage.file)
            : Promise.resolve('');

        uploadCallback()
          .then((url) => {
            this.request
              .checkoutCalculationRequest(
                { ...basicInfo, braceletImage: url },
                remittance,
                { totalPrice: this.prices?.calculationRequestPrice || 500 },
              )
              .then(({ id }) => (this.orderId = id));
            this.userStep.update((prev) => prev + page);
          })
          .finally(() => (this.loading = false));

        break;
      }
      case Step.FAQ: {
        this.router.navigate(['/request-history']);
        break;
      }
      default: {
        this.userStep.update((prev) => prev + page);
      }
    }
  }

  ngOnDestroy(): void {
    this.userForm.unsubscribe();
  }

  onRemoveFile() {
    this.tempImage = null;
  }

  copyToClipboard(copy: string) {
    navigator.clipboard.writeText(copy);
    this.isCopied = true;
    setTimeout(() => (this.isCopied = false), 2000);
  }
}
