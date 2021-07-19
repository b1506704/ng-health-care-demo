import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerStatisticsRoutingModule } from './customer-statistics-routing.module';
import { CustomerStatisticsComponent } from './customer-statistics.component';
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
    CustomerStatisticsRoutingModule,
    DxChartModule,
    DxButtonModule,
    DxRangeSelectorModule,
    DxPolarChartModule,
    DxFunnelModule,
    DxPieChartModule,
  ],
  declarations: [CustomerStatisticsComponent],
})
export class CustomerStatisticsModule {}
