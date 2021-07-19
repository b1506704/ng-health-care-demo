import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConditionDetailComponent } from './condition-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ConditionDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConditionDetailRoutingModule {}
