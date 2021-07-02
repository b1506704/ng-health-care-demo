import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditHealthConditionComponent } from './edit-health-condition.component';

const routes: Routes = [
  {
    path: '',
    component: EditHealthConditionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditHealthConditionRoutingModule {}
