import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  imports: [CommonModule, StatisticsRoutingModule],
  declarations: [StatisticsComponent],
})
export class StatisticsModule {}
