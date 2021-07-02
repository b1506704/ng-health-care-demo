import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditDoctorListComponent } from './edit-doctor-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditDoctorListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDoctorListRoutingModule {}
