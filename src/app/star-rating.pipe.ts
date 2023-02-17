import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'starRating',
})
export class StarRatingPipe implements PipeTransform {
  transform(value: string): string {
    const rating = parseInt(value);
    let stars = '';

    for (let i = 0; i < rating; i++) {
      stars += '★';
    }

    for (let i = rating; i < 5; i++) {
      stars += '☆';
    }

    return stars;
  }
}
