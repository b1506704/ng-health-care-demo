import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthConditionComponent } from './health-condition.component';

const routes: Routes = [
  {
    path: '',
    component: HealthConditionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthConditionRoutingModule {}
