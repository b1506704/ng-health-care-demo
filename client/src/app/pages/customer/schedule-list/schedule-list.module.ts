import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleListRoutingModule } from './schedule-list-routing.module';
import { ScheduleListComponent } from './schedule-list.component';
import { DxButtonModule, DxSchedulerModule, DxToolbarModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, ScheduleListRoutingModule, DxToolbarModule, DxButtonModule, DxSchedulerModule],
  declarations: [ScheduleListComponent],
})
export class ScheduleListModule {}
