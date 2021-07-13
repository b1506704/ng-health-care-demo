import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRoomListRoutingModule } from './edit-room-list-routing.module';
import { EditRoomListComponent } from './edit-room-list.component';
import { DxDataGridModule, DxToolbarModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, EditRoomListRoutingModule,DxDataGridModule,
    DxToolbarModule,
    DxButtonModule,],
  declarations: [EditRoomListComponent],
})
export class EditRoomListModule {}
