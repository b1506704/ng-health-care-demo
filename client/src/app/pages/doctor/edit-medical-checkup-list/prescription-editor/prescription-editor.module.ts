import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrescriptionEditorComponent } from './prescription-editor.component';

const routes: Routes = [
  {
    path: '',
    component: PrescriptionEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrescriptionEditorRoutingModule {}
