import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { combineLatest } from 'rxjs';
import { formatBirthday } from 'src/app/common/utilities';
import { BasicInfoFormComponent } from 'src/app/components/basic-info-form/basic-info-form.component';
import { UserInfoSelectorComponent } from 'src/app/components/user-info-selector/user-info-selector.component';
import { HasBraceletFormComponent } from 'src/app/components/wearer-information/has-bracelet-form.component';
import { Gender } from 'src/app/enums/gender.enum';
import { BasicInfo, Consignee, Wearer } from 'src/app/models/account';
import { FormGroupControls } from 'src/app/models/form';
import { UserFormService } from 'src/app/services/updates/user-form.service';
import { numericValidator } from 'src/app/validators/numberic.validators';
import { twMerge } from 'tailwind-merge';
import { WristSizeFormComponent } from './wrist-size-form.component';

@Component({
  selector: 'app-wearer-information',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    UserInfoSelectorComponent,
    BasicInfoFormComponent,
    WristSizeFormComponent,
    HasBraceletFormComponent,
  ],
  template: `
    <div [class]="containerClass()">
      @if (!hideTitle()) {
        <h2 class="text-lg sm:text-xl font-semibold mb-4">配戴者資訊</h2>
      }

      @if (!hideRecommend()) {
        <app-user-info-selector
          type="basic"
          (userInfoChange)="onUserInfoChange($event)"
        >
        </app-user-info-selector>
      }

      <app-basic-info-form
        [basicInfoForm]="basicInfoForm"
      ></app-basic-info-form>

      <form [formGroup]="restForm">
        @if (!hideWristSize()) {
          <app-wrist-size-form
            [wristSizeControl]="restForm.controls.wristSize"
          ></app-wrist-size-form>
        }

        @if (!hideBracelet()) {
          <app-has-bracelet-form
            [hasBraceletControl]="restForm.controls.hasBracelet"
            [(tempImage)]="tempImage"
          ></app-has-bracelet-form>
        }
      </form>
    </div>
  `,
  styles: ``,
})
export class WearerInformationComponent implements OnDestroy {
  fb = inject(FormBuilder);
  updatedForm = inject(UserFormService);

  basicInfo = input<BasicInfo | null>(null);
  touched = input(false);
  hideBracelet = input(false);
  hideWristSize = input(false);
  hideTitle = input(false);
  hideRecommend = input(false);
  styles = input<Partial<{ container: string }>>({ container: '' });

  wearerFormChange = output<{ data: Wearer | null; valid: boolean }>();
  tempImage = model<{ src: string; file: File } | null>(null);

  twMerge = twMerge;
  Gender = Gender;

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

  restForm = this.fb.nonNullable.group<
    FormGroupControls<
      Pick<Wearer, 'wristSize' | 'hasBracelet' | 'braceletImage'>
    >
  >({
    wristSize: this.fb.nonNullable.control('', [
      Validators.required,
      numericValidator(),
    ]),
    hasBracelet: this.fb.nonNullable.control(false),
    braceletImage: this.fb.nonNullable.control(''),
  });

  containerClass = computed(() =>
    twMerge(
      'bg-white shadow-md rounded-lg p-4 sm:p-6',
      this.styles().container,
    ),
  );

  constructor() {
    effect(() => {
      if (this.touched()) {
        this.basicInfoForm.markAllAsTouched();
        this.restForm.markAllAsTouched();
      }
    });

    effect(() => {
      const hide = this.hideWristSize();

      if (hide) {
        this.restForm.controls.wristSize.clearValidators();
        this.restForm.controls.wristSize.updateValueAndValidity();
      }
    });

    effect(() => {
      const basicInfo = this.basicInfo();

      if (basicInfo) {
        this.basicInfoForm.patchValue(
          {
            ...basicInfo,
            birthday: formatBirthday(basicInfo.birthday),
          },
          { emitEvent: false },
        );
      }
    });

    combineLatest([
      this.basicInfoForm.valueChanges,
      this.restForm.valueChanges,
    ]).subscribe(([basic, rest]) => {
      const wearer: Wearer = {
        ...this.basicInfoForm.getRawValue(),
        ...this.restForm.getRawValue(),
        birthday: formatBirthday(basic.birthday),
      };

      this.wearerFormChange.emit({
        data: wearer,
        valid: this.basicInfoForm.valid && this.restForm.valid,
      });
    });
  }

  ngOnDestroy(): void {
    this.updatedForm.unsubscribe();
  }

  onUserInfoChange(userInfo: Consignee | BasicInfo) {
    const basicInfo = userInfo as BasicInfo;
    this.basicInfoForm.patchValue(basicInfo);
  }
}
