import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorListRoutingModule } from './doctor-list-routing.module';
import { DoctorListComponent } from './doctor-list.component';
import {
  DxScrollViewModule,
  DxToolbarModule,
  DxButtonModule,
  DxSpeedDialActionModule,
  DxPopupModule,
  DxFormModule,
} from 'devextreme-angular';
import { DoctorDetailComponent } from './doctor-detail/doctor-detail.component';

@NgModule({
  imports: [
    CommonModule,
    DoctorListRoutingModule,
    DxScrollViewModule,
    DxToolbarModule,
    DxButtonModule,
    DxSpeedDialActionModule,
    DxPopupModule,
    DxFormModule
  ],
  declarations: [DoctorListComponent, DoctorDetailComponent],
})
export class DoctorListModule {}
