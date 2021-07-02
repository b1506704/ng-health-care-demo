import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDoctorListRoutingModule } from './edit-doctor-list-routing.module';
import { EditDoctorListComponent } from './edit-doctor-list.component';

@NgModule({
  imports: [CommonModule, EditDoctorListRoutingModule],
  declarations: [EditDoctorListComponent],
})
export class EditDoctorListModule {}
