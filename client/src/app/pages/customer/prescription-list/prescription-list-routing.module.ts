import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrescriptionListComponent } from './prescription-list.component';

const routes: Routes = [
  {
    path: '',
    component: PrescriptionListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrescriptionListRoutingModule {}
