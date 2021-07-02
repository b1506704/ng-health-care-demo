import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorListRoutingModule } from './doctor-list-routing.module';
import { DoctorListComponent } from './doctor-list.component';

@NgModule({
  imports: [CommonModule, DoctorListRoutingModule],
  declarations: [DoctorListComponent],
})
export class DoctorListModule {}
