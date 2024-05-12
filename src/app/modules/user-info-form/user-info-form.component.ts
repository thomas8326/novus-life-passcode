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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ContactUsLinksComponent } from 'src/app/components/contact-us-links/contact-us-links.component';
import { ForceLoginDirective } from 'src/app/directives/force-login.directive';
import { Gender } from 'src/app/enums/gender.enum';
import { MyBasicInfo, MyRecipient } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';
import {
  FAQ,
  UserFormService,
} from 'src/app/services/updates/user-form.service';
import { numericValidator } from 'src/app/validators/numberic.validators';

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    ContactUsLinksComponent,
    MatExpansionModule,
    ForceLoginDirective,
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

  customerForm = this.fb.group({
    name: ['', Validators.required],
    birthday: ['', Validators.required],
    gender: [Gender.Female, Validators.required],
    wristSize: [0],
    nationalID: [
      '',
      [Validators.required, Validators.minLength(9), numericValidator()],
    ],
    email: ['', [Validators.email]],
    hasBracelet: [false],
    wantsBox: [false],
    braceletImage: [''],
  });

  recipientForm = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', [Validators.required, numericValidator()]],
    fiveDigits: [
      '',
      [Validators.required, Validators.minLength(5), numericValidator()],
    ],
  });

  cleanFlow = '';
  introduction = '';
  faqs: [string, FAQ][] = [];

  constructor(
    private fb: FormBuilder,
    private userForm: UserFormService,
    private account: AccountService,
    private request: CalculationRequestService,
    private router: Router,
  ) {
    this.userForm.listenCleanFlow((flow) => (this.cleanFlow = flow));
    this.userForm.listenIntroduction(
      (introduction) => (this.introduction = introduction),
    );
    this.userForm.listenFAQs((faqs) => (this.faqs = Object.entries(faqs)));
  }

  onFileChange(file: FileList | null) {}

  goPage(page: number) {
    if (page < 0) {
      this.userStep.update((prev) => prev + page);
      return;
    }

    switch (this.userStep()) {
      case Step.BasicInfo: {
        this.customerForm.markAllAsTouched();
        this.customerForm.valid && this.userStep.update((prev) => prev + page);
        break;
      }
      case Step.Receipt: {
        this.recipientForm.markAllAsTouched();
        if (this.recipientForm.invalid) return;
        const basicInfo = {
          ...this.customerForm.value,
          birthday: new Date(
            this.customerForm.value.birthday || '',
          ).toISOString(),
        } as MyBasicInfo;
        const recipient = this.recipientForm.value as MyRecipient;

        this.request.saveCalculationRequest(basicInfo, recipient);
        this.userStep.update((prev) => prev + page);
        break;
      }
      case Step.FAQ: {
        this.router.navigate(['/']);
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
}
