import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCustomerListComponent } from './edit-customer-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditCustomerListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCustomerListRoutingModule {}
