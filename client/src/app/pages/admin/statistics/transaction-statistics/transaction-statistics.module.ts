import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionStatisticsRoutingModule } from './transaction-statistics-routing.module';
import { TransactionStatisticsComponent } from './transaction-statistics.component';
import {
  DxButtonModule,
  DxChartModule,
  DxFunnelModule,
  DxPieChartModule,
  DxPolarChartModule,
  DxRangeSelectorModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    TransactionStatisticsRoutingModule,
    DxChartModule,
    DxButtonModule,
    DxRangeSelectorModule,
    DxPolarChartModule,
    DxFunnelModule,
    DxPieChartModule,
  ],
  declarations: [TransactionStatisticsComponent],
})
export class TransactionStatisticsModule {}
