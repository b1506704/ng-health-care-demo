import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditDiseaseListComponent } from './edit-disease-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditDiseaseListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDiseaseListRoutingModule {}
