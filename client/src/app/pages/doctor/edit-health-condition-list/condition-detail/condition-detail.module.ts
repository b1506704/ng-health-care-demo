import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionDetailRoutingModule } from './condition-detail-routing.module';
import { ConditionDetailComponent } from './condition-detail.component';
import {
  DxCircularGaugeModule,
  DxLinearGaugeModule,
  DxListModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    ConditionDetailRoutingModule,
    DxLinearGaugeModule,
    DxCircularGaugeModule,
    DxListModule,
  ],
  declarations: [ConditionDetailComponent],
})
export class ConditionDetailModule {}
