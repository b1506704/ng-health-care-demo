import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditScheduleRoutingModule } from './edit-schedule-routing.module';
import { EditScheduleComponent } from './edit-schedule.component';
import {
  DxDataGridModule,
  DxToolbarModule,
  DxButtonModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditScheduleRoutingModule,
    DxDataGridModule,
    DxToolbarModule,
    DxButtonModule,
  ],
  declarations: [EditScheduleComponent],
})
export class EditScheduleModule {}
