import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineListRoutingModule } from './medicine-list-routing.module';
import { MedicineListComponent } from './medicine-list.component';

@NgModule({
  imports: [CommonModule, MedicineListRoutingModule],
  declarations: [MedicineListComponent],
})
export class MedicineListModule {}
