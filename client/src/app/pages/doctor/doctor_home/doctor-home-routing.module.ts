import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorHomeComponent } from './doctor-home.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorHomeRoutingModule {}
