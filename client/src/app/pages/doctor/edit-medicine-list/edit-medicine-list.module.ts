import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMedicineListRoutingModule } from './edit-medicine-list-routing.module';
import { EditMedicineListComponent } from './edit-medicine-list.component';

@NgModule({
  imports: [CommonModule, EditMedicineListRoutingModule],
  declarations: [EditMedicineListComponent],
})
export class EditMedicineListModule {}
