import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCustomerListRoutingModule } from './edit-customer-list-routing.module';
import { EditCustomerListComponent } from './edit-customer-list.component';

@NgModule({
  imports: [CommonModule, EditCustomerListRoutingModule],
  declarations: [EditCustomerListComponent],
})
export class EditCustomerModule {}
