import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMedicineListRoutingModule } from './edit-medicine-list-routing.module';
import { EditMedicineListComponent } from './edit-medicine-list.component';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, EditMedicineListRoutingModule, DxDataGridModule],
  declarations: [EditMedicineListComponent],
})
export class EditMedicineListModule {}
