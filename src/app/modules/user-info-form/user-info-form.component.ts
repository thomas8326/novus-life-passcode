import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { isNotNil } from 'src/app/common/utilities';
import { ContactUsLinksComponent } from 'src/app/components/contact-us-links/contact-us-links.component';
import { RecipientInformationComponent } from 'src/app/components/recipient-information/recipient-information.component';
import { LINE_ID } from 'src/app/consts/app';
import { ForceLoginDirective } from 'src/app/directives/force-login.directive';
import { Gender } from 'src/app/enums/gender.enum';
import { MyBasicInfo, Remittance } from 'src/app/models/account';
import { FileSizePipe } from 'src/app/pipes/fileSize.pipe';
import { TwCurrencyPipe } from 'src/app/pipes/twCurrency.pipe';
import { AccountService } from 'src/app/services/account/account.service';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';
import {
  DEFAULT_PRICES,
  Prices,
  PricesService,
} from 'src/app/services/updates/prices.service';
import {
  CleanFlow,
  FAQ,
  UserFormService,
} from 'src/app/services/updates/user-form.service';
import { numericValidator } from 'src/app/validators/numberic.validators';
import { BankSelectorComponent } from '../../components/bank-selector/bank-selector.component';
import { RemittanceInformationComponent } from '../../components/remittance-information/remittance-information.component';
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

const _5MB = 5 * 1024 * 1024;

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
    RemittanceInformationComponent,
  ],
  templateUrl: './user-info-form.component.html',
  styles: `
    :host {
      --mdc-filled-text-field-container-color: #f0e4ce;
    }
  `,
})
export class UserInfoFormComponent implements OnDestroy {
  @ViewChild(RemittanceInformationComponent)
  RemittanceInformationComponent!: RemittanceInformationComponent;

  private fb = inject(FormBuilder);
  private userForm = inject(UserFormService);
  private recipientService = inject(RecipientService);
  private pricesService = inject(PricesService);
  private request = inject(CalculationRequestService);
  private accountService = inject(AccountService);
  private router = inject(Router);

  userStep = signal(Step.Introduction);
  prices = signal<Prices>(DEFAULT_PRICES);
  deliveryFee = signal<number>(0);

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

  Step = Step;
  Gender = Gender;
  lineId = LINE_ID;
  STEPS = [
    { key: 0, text: '不知道如何選擇？' },
    { key: 1, text: '推算您的生命密碼' },
    { key: 2, text: '簡易淨化教學' },
    { key: 3, text: '轉帳資訊' },
    { key: 4, text: '聯繫我們' },
    { key: 5, text: '常見問題解答' },
  ];
  _5MB = _5MB;

  orderId = signal('');
  isCopied = signal(false);
  touched = signal(false);
  remittance = signal<Remittance | null>(null);
  submittedRemittance = signal<Remittance | null>(null);
  cleanFlow = signal<CleanFlow | null>(null);
  introduction = signal('');
  recipient = signal<Recipient | null>(null);
  faqs = signal<[string, FAQ][]>([]);
  tempImage = signal<{ src: string; file: File } | null>(null);

  errorMsg = signal('');
  loading = signal(false);

  totalPrice = computed(
    () => this.prices().calculationRequestPrice + this.deliveryFee(),
  );

  constructor() {
    this.userForm.listenCleanFlow((flow) => this.cleanFlow.set(flow));
    this.userForm.listenIntroduction((intro) => this.introduction.set(intro));
    this.userForm.listenFAQs((faqs) => this.faqs.set(Object.entries(faqs)));
    this.recipientService.listenRecipient((data) => this.recipient.set(data));
    this.pricesService.listenPrices((prices) => this.prices.set(prices));
    this.accountService.myAccount$.subscribe((myAccount) => {
      if (myAccount) {
        this.remittance.set({
          name: myAccount.name,
          phone: myAccount.phone,
          paymentType: 'normal',
          delivery: {
            zipCode: myAccount.zipCode,
            address: myAccount.address,
          },
          bank: { code: '', name: '', account: '' },
        });
      }
    });
  }

  onFileChange(fileList: FileList | null) {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempImage.set({
          src: e.target.result,
          file,
        });
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
        if (
          isNotNil(this.tempImage()) &&
          this.tempImage()!.file.size > this._5MB
        )
          return;
        this.userStep.update((prev) => prev + page);
        break;
      }
      case Step.Receipt: {
        this.touched.set(true);
        if (this.RemittanceInformationComponent.formGroup.invalid) {
          return;
        }

        const remittance = this.RemittanceInformationComponent.formGroup
          .value as Remittance;
        this.submittedRemittance.set(remittance);

        this.loading.set(true);
        const basicInfo = {
          ...this.customerForm.value,
          birthday: dayjs(this.customerForm.value.birthday || '').toISOString(),
          wristSize: Number(this.customerForm.value.wristSize || 0),
        } as MyBasicInfo;
        const uploadCallback = () =>
          this.tempImage()
            ? this.request.uploadRequestImage(this.tempImage()!.file)
            : Promise.resolve('');

        uploadCallback()
          .then((url) => {
            this.request
              .checkoutCalculationRequest(
                { ...basicInfo, braceletImage: url },
                remittance,
                {
                  totalPrice: this.totalPrice(),
                  itemsPrice: this.prices().calculationRequestPrice,
                  deliveryFee: this.deliveryFee(),
                },
              )
              .then(({ id }) => this.orderId.set(id));
            this.userStep.update((prev) => prev + page);
          })
          .finally(() => this.loading.set(false));

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
    this.tempImage.set(null);
  }

  onDeliveryFeeChange(price: number) {
    this.deliveryFee.set(price);
  }

  copyToClipboard(copy: string) {
    navigator.clipboard.writeText(copy);
    this.isCopied.set(true);
    setTimeout(() => this.isCopied.set(false), 2000);
  }
}
