import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthConditionRoutingModule } from './health-condition-routing.module';
import { HealthConditionComponent } from './health-condition.component';

@NgModule({
  imports: [CommonModule, HealthConditionRoutingModule],
  declarations: [HealthConditionComponent],
})
export class HealthConditionModule {}
