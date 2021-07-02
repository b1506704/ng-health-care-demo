import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditHealthConditionRoutingModule } from './edit-health-condition-routing.module';
import { EditHealthConditionComponent } from './edit-health-condition.component';

@NgModule({
  imports: [CommonModule, EditHealthConditionRoutingModule],
  declarations: [EditHealthConditionComponent],
})
export class EditHealthConditionModule {}
