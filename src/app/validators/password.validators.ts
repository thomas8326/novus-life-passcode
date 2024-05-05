import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const matchingPasswordsValidator: ValidatorFn = (
  formGroup: AbstractControl<any, any>,
): ValidationErrors | null => {
  const password = formGroup.get('password')?.value;
  const confirmPwd = formGroup.get('confirmPwd')?.value;
  return password === confirmPwd ? null : { notMatching: true };
};

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; // 不驗證空值，可由其他驗證器如 required 處理
    }
    const hasNumber = /[0-9]/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    if (hasNumber && hasLetter) {
      return null; // 符合條件，無錯誤
    }
    return { passwordStrength: '密碼必須包含至少一個英文字母和一個數字' };
  };
}
