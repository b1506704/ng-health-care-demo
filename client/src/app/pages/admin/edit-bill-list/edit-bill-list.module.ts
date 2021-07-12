import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBillListRoutingModule } from './edit-bill-list-routing.module';
import { EditBillListComponent } from './edit-bill-list.component';
import { DxDataGridModule, DxToolbarModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditBillListRoutingModule,
    DxDataGridModule,
    DxToolbarModule,
    DxButtonModule,
  ],
  declarations: [EditBillListComponent],
})
export class EditBillListModule {}
