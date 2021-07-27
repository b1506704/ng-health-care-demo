import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsComponent } from './statistics.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    children: [
      {
        path: 'customer',
        loadChildren: () =>
          import('./customer-statistics/customer-statistics.module').then(
            (m) => m.CustomerStatisticsModule
          ),
      },
      {
        path: 'doctor',
        loadChildren: () =>
          import('./doctor-statistics/doctor-statistics.module').then(
            (m) => m.DoctorStatisticsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
