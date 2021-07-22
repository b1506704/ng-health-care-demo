import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditHealthConditionListComponent } from './edit-health-condition-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditHealthConditionListComponent,
    children: [
      {
        path: 'condition/:id',
        outlet: 'conditionOutlet',
        loadChildren: () =>
          import('./condition-detail/condition-detail.module').then(
            (m) => m.ConditionDetailModule
          ),
        data: {
          alwaysRefresh: true,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditHealthConditionRoutingModule {}
