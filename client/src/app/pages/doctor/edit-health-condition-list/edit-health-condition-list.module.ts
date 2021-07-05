import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditHealthConditionRoutingModule } from './edit-health-condition-list-routing.module';
import { EditHealthConditionListComponent } from './edit-health-condition-list.component';
import { DxCircularGaugeModule, DxLinearGaugeModule, DxListModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditHealthConditionRoutingModule,
    DxLinearGaugeModule,
    DxCircularGaugeModule,
    DxListModule
  ],
  declarations: [EditHealthConditionListComponent],
})
export class EditHealthConditionModule {}
