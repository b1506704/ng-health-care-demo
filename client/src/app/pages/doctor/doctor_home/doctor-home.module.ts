import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorHomeRoutingModule } from './doctor-home-routing.module';
import { DoctorHomeComponent } from './doctor-home.component';
import { DxButtonModule, DxGalleryModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    DoctorHomeRoutingModule,
    DxGalleryModule,
    DxButtonModule,
  ],
  declarations: [DoctorHomeComponent],
})
export class DoctorHomeModule {}
