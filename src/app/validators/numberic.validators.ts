import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numberValid(value: any) {
  return /^\d+$/.test(value);
}

export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = numberValid(control.value);
    return valid ? null : { numeric: { value: control.value } };
  };
}

export function taiwanPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^09\d{8}$/.test(control.value);
    return valid ? null : { invalidPhone: { value: control.value } };
  };
}

export function maxAmountValidator(current = 0, total: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentTotal = Number(control.value) + current;
    const invalid = currentTotal > total;
    return invalid ? { max: { max: total, actual: currentTotal } } : null;
  };
}
