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
  signal,
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
import { formatBirthday } from 'src/app/common/utilities';
import { BankSelectorComponent } from 'src/app/components/bank-selector/bank-selector.component';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { InstallmentTutorialComponent } from 'src/app/components/installment-tutorial/installment-tutorial.component';
import { StoreSelectorComponent } from 'src/app/components/store-selector/store-selector.component';
import { Gender } from 'src/app/enums/gender.enum';
import { BasicInfo, Wearer } from 'src/app/models/account';
import { FileSizePipe } from 'src/app/pipes/fileSize.pipe';
import {
  Tutorial,
  UserFormService,
} from 'src/app/services/updates/user-form.service';
import { numericValidator } from 'src/app/validators/numberic.validators';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-wearer-information',
  standalone: true,
  imports: [
    CommonModule,
    BankSelectorComponent,
    MatTabsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    StoreSelectorComponent,
    MatStepperModule,
    MatIconModule,
    InstallmentTutorialComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    FileSizePipe,
    CheckboxComponent,
  ],
  template: `
    <form [formGroup]="formGroup" [class]="containerClass()">
      @if (!hideTitle()) {
        <h2 class="text-lg sm:text-xl font-semibold mb-4">配戴者資訊</h2>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <mat-form-field appearance="outline">
          <mat-label>姓名:</mat-label>
          <input matInput formControlName="name" />
          @if (
            formGroup.get('name')?.hasError('required') &&
            formGroup.get('name')?.touched
          ) {
            <mat-error> 姓名為必填項 </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>出生日期</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="birthday" />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          @if (
            formGroup.get('birthday')?.hasError('required') &&
            formGroup.get('birthday')?.touched
          ) {
            <mat-error> 出生日期為必填項 </mat-error>
          }
        </mat-form-field>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <mat-form-field appearance="outline">
          <mat-label>性別</mat-label>
          <mat-select formControlName="gender">
            <mat-option [value]="Gender.Male">男</mat-option>
            <mat-option [value]="Gender.Female">女</mat-option>
          </mat-select>
          @if (
            formGroup.get('gender')?.hasError('required') &&
            formGroup.get('gender')?.touched
          ) {
            <mat-error> 性別為必填項 </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>身份證字號(輸入數字)</mat-label>
          <mat-hint [align]="'end'">
            {{ this.formGroup.value.nationalID?.length || 0 }}/9
          </mat-hint>
          <input matInput formControlName="nationalID" />
          @if (this.formGroup.controls.nationalID.hasError('required')) {
            <mat-error>請輸入身分證字號</mat-error>
          } @else if (formGroup.get('nationalID')?.hasError('numeric')) {
            <mat-error>請輸入數字</mat-error>
          } @else if (
            formGroup.get('nationalID')?.hasError('minlength') ||
            formGroup.get('nationalID')?.hasError('maxlength')
          ) {
            <mat-error>請輸入九個數字</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="grid grid-cols-1 mb-3">
        <mat-form-field appearance="outline">
          <mat-label>電子郵件</mat-label>
          <input matInput formControlName="email" />
          @if (
            formGroup.get('email')?.hasError('required') &&
            formGroup.get('email')?.touched
          ) {
            <mat-error> 電子郵件為必填項 </mat-error>
          } @else if (
            formGroup.get('email')?.hasError('email') &&
            formGroup.get('email')?.touched
          ) {
            <mat-error> 請輸入有效的電子郵件地址 </mat-error>
          }
        </mat-form-field>
      </div>

      <div class="flex flex-col gap-3 mb-3">
        @if (!hideWristSize()) {
          <div>
            <div
              class="text-mobileSmall sm:text-desktopSmall flex items-center gap-1"
            >
              <span class="text-gray-500">請參考教學影片:</span>
              <a
                [href]="tutorial()?.link"
                target="_blank"
                class="cursor-pointer text-blue-600 myi-4"
              >
                {{ tutorial()?.title }}
              </a>
            </div>

            <div class="text-mobileSmall sm:text-desktopSmall text-gray-500">
              請量測配戴的手，若右撇子為配戴左手，若左撇子為配戴右手，若雙手慣用者請配戴左手。
            </div>
          </div>

          <div>
            <mat-form-field appearance="outline">
              <mat-label>手圍</mat-label>
              <input matInput formControlName="wristSize" />
              @if (
                formGroup.get('wristSize')?.hasError('required') &&
                formGroup.get('wristSize')?.touched
              ) {
                <mat-error>請填入你的手圍</mat-error>
              } @else if (
                formGroup.get('wristSize')?.hasError('numeric') &&
                formGroup.get('wristSize')?.touched
              ) {
                <mat-error>請輸入數字</mat-error>
              }
            </mat-form-field>
          </div>
        }
      </div>

      <div class="flex flex-col gap-2">
        @if (!hideBracelet()) {
          <label class="flex items-center cursor-pointer gap-1.5">
            <app-checkbox
              [checked]="formGroup.value.hasBracelet ?? false"
              (checkedChange)="
                this.formGroup.patchValue({ hasBracelet: $event });
                this.onRemoveFile()
              "
            >
            </app-checkbox>
            <span class="text-mobileContent sm:text-desktopContent"
              >是否有搭配過生命密碼手鍊</span
            >
          </label>
        }

        @if (formGroup.value.hasBracelet && !hideImageUpload()) {
          <div class="my-2">
            <div>
              <input
                type="file"
                class="appearance-none hidden"
                #file
                multiple="false"
                accept="image/*"
                (change)="onFileChange(file.files)"
              />
              @let tempImageData = tempImage();
              @if (tempImageData) {
                <div
                  class="flex flex-col sm:flex-row gap-2 sm:items-center my-2 relative border sm:border-0 border-gray-400 rounded p-2"
                >
                  <img
                    [src]="tempImageData.src"
                    alt="Product Image"
                    class="w-16 h-16 sm:w-32 sm:h-32"
                  />
                  <div class="line-clamp-5 flex-1">
                    {{ tempImageData.file.name }}
                  </div>
                  <div class="flex-none">
                    {{ tempImageData.file.size | fileSize }}
                    @if (tempImageData.file.size > FileSize5MB) {
                      <div
                        class="text-red-500 sm:text-desktopSmall text-mobileSmall"
                      >
                        檔案大小超過5MB
                      </div>
                    }
                  </div>
                  <button
                    mat-button
                    class="sm:!p-4 !absolute top-0 -right-2 sm:!relative"
                    (click)="$event.stopPropagation(); onRemoveFile()"
                  >
                    <mat-icon class="!w-6 !h-6 !text-[24px] !m-0"
                      >close</mat-icon
                    >
                  </button>
                </div>
              }
              <button
                type="button"
                mat-raised-button
                color="primary"
                (click)="file.click()"
              >
                上傳手鍊圖片
              </button>
            </div>
            <div class="text-mobileSmall sm:text-desktopSmall text-gray-600">
              *檔案大小勿超過5MB* <br />
              *將已搭配的生命密碼手鍊一起放在桌面上拍攝若有搭配三條，則三條都在同一張照片即可*
            </div>
          </div>
        }
      </div>
    </form>
  `,
  styles: ``,
})
export class WearerInformationComponent implements OnDestroy {
  basicInfo = input<BasicInfo | null>(null);
  touched = input(false);
  hideImageUpload = input(false);
  hideBracelet = input(false);
  hideWristSize = input(false);
  hideTitle = input(false);
  styles = input<Partial<{ container: string }>>({ container: '' });

  wearerFormChange = output<{ data: Wearer | null; valid: boolean }>();
  tempImage = model<{ src: string; file: File } | null>(null);

  fb = inject(FormBuilder);
  updatedForm = inject(UserFormService);

  tutorial = signal<Tutorial | null>(null);

  twMerge = twMerge;
  Gender = Gender;
  FileSize5MB = 5 * 1024 * 1024;

  formGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
    gender: [Gender.Female, Validators.required],
    birthday: ['', Validators.required],
    nationalID: [
      '',
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        numericValidator(),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    wristSize: ['', [Validators.required, numericValidator()]],
    hasBracelet: [false],
    braceletImage: [''],
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
        this.formGroup.markAllAsTouched();
      }
    });

    effect(() => {
      const hide = this.hideWristSize();

      if (hide) {
        this.formGroup.controls.wristSize.clearValidators();
        this.formGroup.controls.wristSize.updateValueAndValidity();
      }
    });

    effect(() => {
      const wearer = this.basicInfo();

      if (wearer) {
        this.formGroup.patchValue({
          ...wearer,
          birthday: formatBirthday(wearer.birthday),
        });
      }
    });

    this.updatedForm.listenTutorial((data) => {
      this.tutorial.set(data);
    });

    this.formGroup.valueChanges.subscribe((value) => {
      const wearer = {
        ...this.formGroup.getRawValue(),
        wristSize: Number(value.wristSize),
        birthday: formatBirthday(value.birthday),
      };

      this.wearerFormChange.emit({ data: wearer, valid: this.formGroup.valid });
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

  onRemoveFile() {
    this.tempImage.set(null);
  }

  ngOnDestroy(): void {
    this.updatedForm.unsubscribe();
  }
}
