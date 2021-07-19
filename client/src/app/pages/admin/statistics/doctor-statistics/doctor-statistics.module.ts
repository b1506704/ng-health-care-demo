import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorStatisticsRoutingModule } from './doctor-statistics-routing.module';
import { DoctorStatisticsComponent } from './doctor-statistics.component';
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
    DoctorStatisticsRoutingModule,
    DxChartModule,
    DxButtonModule,
    DxRangeSelectorModule,
    DxPolarChartModule,
    DxFunnelModule,
    DxPieChartModule,
  ],
  declarations: [DoctorStatisticsComponent],
})
export class DoctorStatisticsModule {}
