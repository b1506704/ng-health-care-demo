import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorListRoutingModule } from './doctor-list-routing.module';
import { DoctorListComponent } from './doctor-list.component';
import {
  DxScrollViewModule,
  DxToolbarModule,
  DxButtonModule,
  DxSpeedDialActionModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    DoctorListRoutingModule,
    DxScrollViewModule,
    DxToolbarModule,
    DxButtonModule,
    DxSpeedDialActionModule,
  ],
  declarations: [DoctorListComponent],
})
export class DoctorListModule {}
