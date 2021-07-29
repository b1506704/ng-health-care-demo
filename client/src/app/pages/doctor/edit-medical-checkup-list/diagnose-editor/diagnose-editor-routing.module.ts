import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiagnoseEditorComponent } from './diagnose-editor.component';

const routes: Routes = [
  {
    path: '',
    component: DiagnoseEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnoseEditorRoutingModule {}
