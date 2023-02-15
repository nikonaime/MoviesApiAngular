import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'commaSeparatedToArray',
})
export class CommaSeparatedToArrayPipe implements PipeTransform {
  transform(value: any): any {
    return value.split(', ');
  }
}
