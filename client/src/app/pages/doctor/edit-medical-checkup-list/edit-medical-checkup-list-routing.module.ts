import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMedicalCheckupListComponent } from './edit-medical-checkup-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditMedicalCheckupListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMedicalCheckupListRoutingModule {}
