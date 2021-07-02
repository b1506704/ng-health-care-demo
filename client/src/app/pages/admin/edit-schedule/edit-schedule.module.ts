import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditScheduleRoutingModule } from './edit-schedule-routing.module';
import { EditScheduleComponent } from './edit-schedule.component';

@NgModule({
  imports: [CommonModule, EditScheduleRoutingModule],
  declarations: [EditScheduleComponent],
})
export class EditScheduleModule {}
