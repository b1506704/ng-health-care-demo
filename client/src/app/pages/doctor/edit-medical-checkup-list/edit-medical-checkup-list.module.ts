import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMedicalCheckupListRoutingModule } from './edit-medical-checkup-list-routing.module';
import { EditMedicalCheckupListComponent } from './edit-medical-checkup-list.component';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, EditMedicalCheckupListRoutingModule, DxDataGridModule],
  declarations: [EditMedicalCheckupListComponent],
})
export class EditMedicalCheckupListModule {}
