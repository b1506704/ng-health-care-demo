import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMedicineListRoutingModule } from './edit-medicine-list-routing.module';
import { EditMedicineListComponent } from './edit-medicine-list.component';
import {
  DxButtonModule,
  DxDataGridModule,
  DxToolbarModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditMedicineListRoutingModule,
    DxDataGridModule,
    DxToolbarModule,
    DxButtonModule,
  ],
  declarations: [EditMedicineListComponent],
})
export class EditMedicineListModule {}
