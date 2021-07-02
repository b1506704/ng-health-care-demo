import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillListRoutingModule } from './bill-list-routing.module';
import { BillListComponent } from './bill-list.component';

@NgModule({
  imports: [CommonModule, BillListRoutingModule],
  declarations: [BillListComponent],
})
export class BillListModule {}
