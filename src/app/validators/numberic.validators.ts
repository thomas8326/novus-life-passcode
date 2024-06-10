import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { numeric: { value: control.value } };
  };
}

export function taiwanPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^09\d{8}$/.test(control.value);
    return valid ? null : { invalidPhone: { value: control.value } };
  };
}
