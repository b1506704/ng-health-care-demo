import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorHomeRoutingModule } from './doctor-home-routing.module';
import { DoctorHomeComponent } from './doctor-home.component';
import { DxBoxModule, DxButtonModule, DxGalleryModule, DxTabPanelModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, DoctorHomeRoutingModule, DxGalleryModule, DxButtonModule, DxBoxModule,DxTabPanelModule],
  declarations: [DoctorHomeComponent],
})
export class DoctorHomeModule {}
