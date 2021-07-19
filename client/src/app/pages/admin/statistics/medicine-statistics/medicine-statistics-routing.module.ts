import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicineStatisticsComponent } from './medicine-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: MedicineStatisticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicineStatisticsRoutingModule {}
