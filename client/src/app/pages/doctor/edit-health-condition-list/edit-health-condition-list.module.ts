import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditHealthConditionRoutingModule } from './edit-health-condition-list-routing.module';
import { EditHealthConditionListComponent } from './edit-health-condition-list.component';
import {
  DxBoxModule,
  DxButtonModule,
  DxListModule,
  DxToolbarModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditHealthConditionRoutingModule,
    DxBoxModule,
    DxListModule,
    DxToolbarModule,
    DxButtonModule,
  ],
  declarations: [EditHealthConditionListComponent],
})
export class EditHealthConditionModule {}
