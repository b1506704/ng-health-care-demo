import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditHealthConditionListComponent } from './edit-health-condition-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditHealthConditionListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditHealthConditionRoutingModule {}
