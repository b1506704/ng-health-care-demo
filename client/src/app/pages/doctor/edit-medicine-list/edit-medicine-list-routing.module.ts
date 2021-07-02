import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMedicineListComponent } from './edit-medicine-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditMedicineListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMedicineListRoutingModule {}
