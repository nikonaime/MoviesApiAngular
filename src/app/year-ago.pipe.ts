import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yearAgo',
})
export class YearAgoPipe implements PipeTransform {
  transform(value: any): string {
    const currentYear = new Date().getFullYear();
    const year = parseInt(value, 10);
    const yearsAgo = currentYear - year;
    return `${yearsAgo} years ago`;
  }
}
