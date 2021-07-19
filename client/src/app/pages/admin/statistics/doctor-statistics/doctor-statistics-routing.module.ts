import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorStatisticsComponent } from './doctor-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorStatisticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorStatisticsRoutingModule {}
