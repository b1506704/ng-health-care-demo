import { Pipe, PipeTransform } from '@angular/core';
import formatCurrency from 'src/app/utils/formatCurrency';

@Pipe({
  name: 'formatCurrency',
})
export class FormatCurrency implements PipeTransform {
  transform(amount: number, currency: string): string {
    let defaultCurrency = '$';
    if (amount) {
      if (!currency) {
        return formatCurrency(amount, defaultCurrency);
      } else {
        return formatCurrency(amount, currency);
      }
    }
  }
}
