import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'ramda';

@Pipe({
  name: 'sortBy',
  standalone: true,
})
export class SortByPipe<T> implements PipeTransform {
  transform(
    array: T[] | null,
    field: string,
    isAscending: boolean = true,
  ): T[] {
    if (isNil(array) || !Array.isArray(array)) {
      return [];
    }
    array.sort((a, b) => {
      const aField = (a as any)[field];
      const bField = (b as any)[field];

      if (aField < bField) {
        return isAscending ? -1 : 1;
      } else if (aField > bField) {
        return isAscending ? 1 : -1;
      }
      return 0;
    });
    return array;
  }
}
