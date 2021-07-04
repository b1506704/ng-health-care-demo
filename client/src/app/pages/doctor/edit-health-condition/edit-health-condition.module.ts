import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditHealthConditionRoutingModule } from './edit-health-condition-routing.module';
import { EditHealthConditionComponent } from './edit-health-condition.component';
import { DxCircularGaugeModule, DxLinearGaugeModule, DxListModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditHealthConditionRoutingModule,
    DxLinearGaugeModule,
    DxCircularGaugeModule,
    DxListModule
  ],
  declarations: [EditHealthConditionComponent],
})
export class EditHealthConditionModule {}
