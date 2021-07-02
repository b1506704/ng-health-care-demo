import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditThemeComponent } from './edit-theme.component';

const routes: Routes = [
  {
    path: '',
    component: EditThemeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditThemeRoutingModule {}
