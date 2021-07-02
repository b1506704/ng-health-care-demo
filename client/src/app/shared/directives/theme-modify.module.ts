import { NgModule } from '@angular/core';
import { ThemeModifyDirective } from './theme-modify.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [ThemeModifyDirective],
  exports: [ThemeModifyDirective],
})
export class ThemeMofidfyModule {}
