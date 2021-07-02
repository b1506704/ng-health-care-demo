import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillDetailRoutingModule } from './bill-detail-routing.module';
import { BillDetailComponent } from './bill-detail.component';

@NgModule({
  imports: [CommonModule, BillDetailRoutingModule],
  declarations: [BillDetailComponent],
})
export class HouseDetailModule {}
