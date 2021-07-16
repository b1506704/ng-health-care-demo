import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import { DxButtonModule, DxChartModule, DxFunnelModule, DxPieChartModule, DxPolarChartModule, DxRangeSelectorModule, DxToolbarModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, StatisticsRoutingModule, DxChartModule, DxToolbarModule, DxButtonModule, DxRangeSelectorModule, DxPolarChartModule, DxFunnelModule, DxPieChartModule],
  declarations: [StatisticsComponent],
})
export class StatisticsModule {}
