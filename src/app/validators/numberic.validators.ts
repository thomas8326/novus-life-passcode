import { AbstractControl, ValidatorFn } from '@angular/forms';

export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { numeric: { value: control.value } };
  };
}
