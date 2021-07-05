import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicalCheckupComponent } from './medical-checkup.component';

const routes: Routes = [
  {
    path: '',
    component: MedicalCheckupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalCheckupRoutingModule {}
