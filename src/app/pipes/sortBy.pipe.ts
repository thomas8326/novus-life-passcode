import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'src/app/common/utilities';

@Pipe({
  name: 'sortBy',
  standalone: true,
})
export class SortByPipe implements PipeTransform {
  transform<T>(
    array: T[] | null,
    field: string,
    isAscending: boolean = true,
  ): T[] {
    if (isNil(array) || !Array.isArray(array)) {
      return [] as T[];
    }
    array.sort((a, b) => {
      let aField = (a as any)[field];
      let bField = (b as any)[field];

      aField = typeof aField === 'string' ? new Date(aField).getTime() : aField;
      bField = typeof bField === 'string' ? new Date(bField).getTime() : bField;

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
