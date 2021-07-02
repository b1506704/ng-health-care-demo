import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBillListRoutingModule } from './edit-bill-list-routing.module';
import { EditBillListComponent } from './edit-bill-list.component';

@NgModule({
  imports: [CommonModule, EditBillListRoutingModule],
  declarations: [EditBillListComponent],
})
export class EditBillListModule {}
