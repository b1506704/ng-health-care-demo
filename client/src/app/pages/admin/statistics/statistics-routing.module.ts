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
      {
        path: 'medicine',
        loadChildren: () =>
          import('./medicine-statistics/medicine-statistics.module').then(
            (m) => m.MedicineStatisticsModule
          ),
      },
      {
        path: 'transaction',
        loadChildren: () =>
          import('./transaction-statistics/transaction-statistics.module').then(
            (m) => m.TransactionStatisticsModule
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
