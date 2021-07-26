import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserListRoutingModule } from './edit-user-list-routing.module';
import { EditUserListComponent } from './edit-user-list.component';
import { DxDataGridModule, DxToolbarModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditUserListRoutingModule,
    DxDataGridModule,
    DxToolbarModule,
    DxButtonModule,
  ],
  declarations: [EditUserListComponent],
})
export class EditUserListModule {}
