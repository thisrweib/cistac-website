import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const strValue = value.toString().replace(/\D/g, '');

    if (strValue.length !== 12 || !strValue.startsWith('90')) {
      return value.toString();
    }

    const countryCode = '+90';
    const areaCode = strValue.substring(2, 5);
    const part1 = strValue.substring(5, 8);
    const part2 = strValue.substring(8, 12);

    return `${countryCode} ${areaCode} ${part1} ${part2}`;
  }
}
