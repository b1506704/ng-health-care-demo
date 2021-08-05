import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineListRoutingModule } from './medicine-list-routing.module';
import { MedicineListComponent } from './medicine-list.component';
import {
  DxButtonModule,
  DxScrollViewModule,
  DxSpeedDialActionModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { FormatCurrencyModule } from 'src/app/shared/pipes/formatCurrency.module';

@NgModule({
  imports: [
    CommonModule,
    MedicineListRoutingModule,
    DxScrollViewModule,
    DxToolbarModule,
    DxButtonModule,
    DxSpeedDialActionModule,
    FormatCurrencyModule,
  ],
  declarations: [MedicineListComponent],
})
export class MedicineListModule {}
