import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractNames',
})
export class ExtractNamesPipe implements PipeTransform {
  transform(value: any): any {
    const names = value.split(',');
    const firstNames = names.map((name : any) => name.trim().split(' ')[0]);
    return firstNames.join(', ');
  }
}
