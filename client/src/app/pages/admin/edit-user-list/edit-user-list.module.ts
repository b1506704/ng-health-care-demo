import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserListRoutingModule } from './edit-user-list-routing.module';
import { EditUserListComponent } from './edit-user-list.component';

@NgModule({
  imports: [CommonModule, EditUserListRoutingModule],
  declarations: [EditUserListComponent],
})
export class EditUserListModule {}
