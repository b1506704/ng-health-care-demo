import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorHomeRoutingModule } from './doctor-home-routing.module';
import { DoctorHomeComponent } from './doctor-home.component';

@NgModule({
  imports: [CommonModule, DoctorHomeRoutingModule],
  declarations: [DoctorHomeComponent],
})
export class DoctorHomeModule {}
