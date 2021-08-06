import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineListRoutingModule } from './medicine-list-routing.module';
import { MedicineListComponent } from './medicine-list.component';
import {
  DxButtonModule,
  DxFormModule,
  DxPopupModule,
  DxScrollViewModule,
  DxSpeedDialActionModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { FormatCurrencyModule } from 'src/app/shared/pipes/formatCurrency.module';
import { MedicineDetailComponent } from './medicine-detail/medicine-detail.component';

@NgModule({
  imports: [
    CommonModule,
    MedicineListRoutingModule,
    DxScrollViewModule,
    DxToolbarModule,
    DxButtonModule,
    DxSpeedDialActionModule,
    FormatCurrencyModule,
    DxPopupModule,
    DxFormModule
  ],
  declarations: [MedicineListComponent, MedicineDetailComponent],
})
export class MedicineListModule {}
