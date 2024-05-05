import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
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
  ],
  templateUrl: './admin-account.component.html',
  styles: ``,
})
export class AdminAccountComponent {
  submitted = false;

  loadAdmins$ = this.account.loadAdmins();

  adminForm = this.fb.group(
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

  constructor(
    private readonly fb: FormBuilder,
    private readonly account: AccountService,
  ) {}

  onCrateAdmin() {
    this.submitted = true;
    if (this.adminForm.invalid) {
      return;
    }

    const { alias, email, password } = this.adminForm.value;
    this.account.createAdminAccount(alias!, email!, password!);
  }

  onEnabledAdminAccount(uid: string, enabled: boolean) {
    this.account.enabledAdminAccount(uid, enabled);
  }
}
