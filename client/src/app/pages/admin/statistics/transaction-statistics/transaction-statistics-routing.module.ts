import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionStatisticsComponent } from './transaction-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionStatisticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionStatisticsRoutingModule {}
