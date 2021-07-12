import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCustomerListRoutingModule } from './edit-customer-list-routing.module';
import { EditCustomerListComponent } from './edit-customer-list.component';
import {
  DxDataGridModule,
  DxToolbarModule,
  DxButtonModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditCustomerListRoutingModule,
    DxDataGridModule,
    DxToolbarModule,
    DxButtonModule,
  ],
  declarations: [EditCustomerListComponent],
})
export class EditCustomerModule {}
