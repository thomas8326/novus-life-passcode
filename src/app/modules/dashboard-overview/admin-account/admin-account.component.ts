import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService } from 'src/app/services/account/account.service';
import {
  matchingPasswordsValidator,
  passwordStrengthValidator,
} from 'src/app/validators/password.validators';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    MatButtonModule,
    AsyncPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-account.component.html',
  styles: ``,
})
export class AdminAccountComponent {
  private fb = inject(FormBuilder);
  private account = inject(AccountService);

  submitted = signal(false);
  loading = signal(false);

  adminForm = this.fb.nonNullable.group(
    {
      alias: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          passwordStrengthValidator(),
        ],
      ],
      confirmPwd: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          passwordStrengthValidator(),
        ],
      ],
    },
    { validators: matchingPasswordsValidator },
  );

  loadAdmins = toSignal(this.account.loadAdmins());

  aliasErrors = computed(() => {
    const control = this.adminForm.controls.alias;
    if (control.hasError('required') && (control.touched || this.submitted())) {
      return '請輸入名字';
    }
    return '';
  });

  emailErrors = computed(() => {
    const control = this.adminForm.controls.email;
    if (control.hasError('required') && (control.touched || this.submitted())) {
      return '請輸入信箱';
    }
    if (control.hasError('email') && (control.touched || this.submitted())) {
      return '請輸入正確的格式';
    }
    return '';
  });

  passwordErrors = computed(() => {
    const control = this.adminForm.controls.password;
    if (control.hasError('required') && (control.touched || this.submitted())) {
      return '請輸入密碼';
    }
    if (
      control.hasError('minlength') &&
      (control.touched || this.submitted())
    ) {
      return '請輸入8個以上數字';
    }
    if (
      control.hasError('passwordStrength') &&
      (control.touched || this.submitted())
    ) {
      return '至少包含一個數字與英文';
    }
    return '';
  });

  confirmPwdErrors = computed(() => {
    const control = this.adminForm.controls.confirmPwd;
    if (control.hasError('required') && (control.touched || this.submitted())) {
      return '請輸入密碼';
    }
    if (
      control.hasError('minlength') &&
      (control.touched || this.submitted())
    ) {
      return '請輸入8個以上數字';
    }
    if (
      control.hasError('passwordStrength') &&
      (control.touched || this.submitted())
    ) {
      return '至少包含一個數字與英文';
    }
    return '';
  });

  formErrors = computed(() => {
    if (this.adminForm.hasError('notMatching') && this.submitted()) {
      return '兩個密碼不相同';
    }
    return '';
  });

  onCrateAdmin() {
    this.submitted.set(true);
    if (this.adminForm.invalid && this.account.getMyAccount()?.isSuperAdmin) {
      return;
    }

    const { alias, email, password } = this.adminForm.getRawValue();
    this.loading.set(true);
    this.account.createAdminAccount(alias, email, password).finally(() => {
      this.loading.set(false);
    });
    this.adminForm.reset();
    this.adminForm.markAsUntouched();
    this.submitted.set(false);
  }

  onEnabledAdminAccount(uid: string, enabled: boolean) {
    this.account.enabledAdminAccount(uid, enabled);
  }
}
