import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRoomListRoutingModule } from './edit-room-list-routing.module';
import { EditRoomListComponent } from './edit-room-list.component';

@NgModule({
  imports: [CommonModule, EditRoomListRoutingModule],
  declarations: [EditRoomListComponent],
})
export class EditRoomListModule {}
