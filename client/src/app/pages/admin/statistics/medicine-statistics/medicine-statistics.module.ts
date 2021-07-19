import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineStatisticsRoutingModule } from './medicine-statistics-routing.module';
import {MedicineStatisticsComponent } from './medicine-statistics.component';
import {
  DxButtonModule,
  DxChartModule,
  DxFunnelModule,
  DxPieChartModule,
  DxPolarChartModule,
  DxRangeSelectorModule,
  DxSpeedDialActionModule,
  DxToolbarModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    MedicineStatisticsRoutingModule,
    DxChartModule,
    DxButtonModule,
    DxRangeSelectorModule,
    DxPolarChartModule,
    DxFunnelModule,
    DxPieChartModule,
  ],
  declarations: [MedicineStatisticsComponent],
})
export class MedicineStatisticsModule {}
