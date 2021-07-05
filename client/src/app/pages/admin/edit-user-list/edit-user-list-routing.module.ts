import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditUserListComponent } from './edit-user-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditUserListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUserListRoutingModule {}
