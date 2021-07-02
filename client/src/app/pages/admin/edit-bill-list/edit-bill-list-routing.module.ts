import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditBillListComponent } from './edit-bill-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditBillListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditBillListRoutingModule {}
