import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { formatBirthday } from 'src/app/common/utilities';
import { BasicInfoFormComponent } from 'src/app/components/basic-info-form/basic-info-form.component';
import { ContactUsLinksComponent } from 'src/app/components/contact-us-links/contact-us-links.component';
import { CrystalKnowledgeComponent } from 'src/app/components/crystal-knowledge/crystal-knowledge.component';
import { QuerentInfoDisplayComponent } from 'src/app/components/querent-information/querent-info-display';
import { RecipientInfoDisplayComponent } from 'src/app/components/recipient-information/recipient-info-display.component';
import { RemittanceInfoDisplayComponent } from 'src/app/components/remittance-information/remittance-info-display';
import { UserInfoSelectorComponent } from 'src/app/components/user-info-selector/user-info-selector.component';
import { LINE_ID } from 'src/app/consts/app';
import { ForceLoginDirective } from 'src/app/directives/force-login.directive';
import { Gender } from 'src/app/enums/gender.enum';
import {
  BasicInfo,
  Consignee,
  Querent,
  Remittance,
} from 'src/app/models/account';
import { FormGroupControls } from 'src/app/models/form';
import { UserBank } from 'src/app/services/bank/bank.service';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';
import {
  DEFAULT_PRICES,
  Prices,
  PricesService,
} from 'src/app/services/updates/prices.service';
import {
  FAQ,
  UserFormService,
} from 'src/app/services/updates/user-form.service';
import {
  numericValidator,
  taiwanPhoneValidator,
} from 'src/app/validators/numberic.validators';
import { ConsigneeFormComponent } from '../../components/remittance-information/consignee-form.component';
import { RemittanceFormComponent } from '../../components/remittance-information/remittance-form.component';
import {
  Recipient,
  RecipientService,
} from '../../services/updates/recipient.service';

enum Step {
  Introduction,
  BasicInfo,
  Receipt,
  Confirm,
  ContactUs,
  FAQ,
}

@Component({
  selector: 'app-user-info-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    ContactUsLinksComponent,
    MatExpansionModule,
    ForceLoginDirective,
    RouterLink,
    RecipientInfoDisplayComponent,
    QuerentInfoDisplayComponent,
    RemittanceFormComponent,
    RemittanceInfoDisplayComponent,
    CrystalKnowledgeComponent,
    UserInfoSelectorComponent,
    BasicInfoFormComponent,
    ConsigneeFormComponent,
  ],
  templateUrl: './user-info-form.component.html',
  styles: `
    :host {
      --mdc-filled-text-field-container-color: #f0e4ce;
    }
  `,
})
export class UserInfoFormComponent implements OnDestroy {
  @ViewChild(RemittanceFormComponent)
  RemittanceInformationComponent!: RemittanceFormComponent;

  private fb = inject(FormBuilder);
  private userForm = inject(UserFormService);
  private recipientService = inject(RecipientService);
  private pricesService = inject(PricesService);
  private request = inject(CalculationRequestService);
  private router = inject(Router);

  userStep = signal(Step.Introduction);
  prices = signal<Prices>(DEFAULT_PRICES);
  knowledgeChecked = signal(false);

  basicInfoForm = this.fb.nonNullable.group<FormGroupControls<BasicInfo>>({
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
  });

  querentRestForm = this.fb.group<
    FormGroupControls<Omit<Querent, keyof BasicInfo>>
  >({
    jobOccupation: this.fb.nonNullable.control(''),
    wanting: this.fb.nonNullable.control(''),
  });

  consigneeForm = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    phone: this.fb.nonNullable.control('', [
      Validators.required,
      numericValidator(),
      taiwanPhoneValidator(),
    ]),
    bank: this.fb.nonNullable.group<FormGroupControls<UserBank>>({
      code: this.fb.nonNullable.control('', Validators.required),
      name: this.fb.nonNullable.control('', Validators.required),
      account: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    }),
  });

  Step = Step;
  Gender = Gender;
  lineId = LINE_ID;
  STEPS = [
    { key: Step.Introduction, text: '不知道如何選擇？' },
    { key: Step.BasicInfo, text: '推算您的生命密碼' },
    { key: Step.Receipt, text: '轉帳資訊' },
    { key: Step.Confirm, text: '確認您的資料' },
    { key: Step.ContactUs, text: '聯繫我們' },
    { key: Step.FAQ, text: '常見問題解答' },
  ];

  orderId = signal('');
  isCopied = signal(false);
  consignee = signal<Consignee | null>(null);
  introduction = signal('');
  recipient = signal<Recipient | null>(null);
  faqs = signal<[string, FAQ][]>([]);
  querent = signal<Querent | null>(null);

  errorMsg = signal('');
  loading = signal(false);
  remittanceForm = signal<{ data: Remittance | null; valid: boolean }>({
    data: null,
    valid: false,
  });

  constructor() {
    this.userForm.listenIntroduction((intro) => this.introduction.set(intro));
    this.userForm.listenFAQs((faqs) => this.faqs.set(Object.entries(faqs)));
    this.recipientService.listenRecipient((data) => this.recipient.set(data));
    this.pricesService.listenPrices((prices) => this.prices.set(prices));
  }

  goPage(page: number) {
    if (page < 0) {
      this.userStep.update((prev) => prev + page);
      return;
    }

    switch (this.userStep()) {
      case Step.BasicInfo: {
        this.basicInfoForm.markAllAsTouched();
        this.querentRestForm.markAllAsTouched();
        if (this.basicInfoForm.invalid || this.querentRestForm.invalid) {
          return;
        }

        const querent = {
          ...this.basicInfoForm.getRawValue(),
          ...this.querentRestForm.getRawValue(),
          birthday: formatBirthday(this.basicInfoForm.value.birthday),
        } as Querent;

        this.querent.set(querent);
        this.userStep.update((prev) => prev + page);
        break;
      }
      case Step.Receipt: {
        this.consigneeForm.markAllAsTouched();

        if (this.consigneeForm.invalid) {
          return;
        }

        this.consignee.set(this.consigneeForm.getRawValue());
        this.userStep.update((prev) => prev + page);
        break;
      }
      case Step.Confirm: {
        if (!this.querent() || !this.consignee()) {
          return;
        }
        this.loading.set(true);

        this.request
          .checkoutCalculationRequest(this.querent()!, this.consignee()!, {
            totalPrice: this.prices().calculationRequestPrice,
            itemsPrice: this.prices().calculationRequestPrice,
            deliveryFee: 0,
          })
          .then(({ id }) => {
            this.orderId.set(id);
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

  copyToClipboard(copy: string) {
    navigator.clipboard.writeText(copy);
    this.isCopied.set(true);
    setTimeout(() => this.isCopied.set(false), 2000);
  }

  onRemittanceChange(form: { data: Remittance | null; valid: boolean }) {
    this.remittanceForm.set(form);
  }

  onUserInfoChange(userInfo: Consignee | BasicInfo) {
    this.basicInfoForm.patchValue(userInfo);
  }

  onConsigneeInfoChange(userInfo: Consignee | BasicInfo) {
    this.consigneeForm.patchValue(userInfo);
  }
}
