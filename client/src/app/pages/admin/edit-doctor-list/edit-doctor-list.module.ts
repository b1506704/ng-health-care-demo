import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDoctorListRoutingModule } from './edit-doctor-list-routing.module';
import { EditDoctorListComponent } from './edit-doctor-list.component';
import { DxDataGridModule, DxToolbarModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditDoctorListRoutingModule,
    DxDataGridModule,
    DxToolbarModule,
    DxButtonModule,
  ],
  declarations: [EditDoctorListComponent],
})
export class EditDoctorListModule {}
