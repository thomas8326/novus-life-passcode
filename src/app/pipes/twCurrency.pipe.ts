import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { LOCALE_ID, Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
  name: 'twCurrency',
  standalone: true,
})
export class TwCurrencyPipe implements PipeTransform {
  private locale_id = inject(LOCALE_ID);

  transform(value?: number): string | null {
    const _value = value ?? 0;

    return formatCurrency(
      _value,
      this.locale_id,
      getCurrencySymbol('TWD', 'wide'),
      'TWD',
      '0.0-0',
    );
  }
}
