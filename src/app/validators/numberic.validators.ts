import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { numeric: { value: control.value } };
  };
}
