import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerStatisticsComponent } from './customer-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerStatisticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerStatisticsRoutingModule {}
