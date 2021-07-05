import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditRoomListComponent } from './edit-room-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditRoomListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRoomListRoutingModule {}
