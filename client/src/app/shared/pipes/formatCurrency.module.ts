import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatCurrency } from './formatCurrency.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [FormatCurrency],
  exports: [FormatCurrency],
})
export class FormatCurrencyModule {}
