import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPrescriptionListComponent } from './edit-prescription-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditPrescriptionListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPrescriptionListRoutingModule {}
