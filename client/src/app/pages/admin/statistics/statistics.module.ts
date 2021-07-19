import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import {
  DxButtonModule,
  DxSpeedDialActionModule,
  DxToolbarModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    DxToolbarModule,
    DxButtonModule,
    DxSpeedDialActionModule,
  ],
  declarations: [StatisticsComponent],
})
export class StatisticsModule {}
