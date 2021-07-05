import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalCheckupRoutingModule } from './medical-checkup-routing.module';
import { MedicalCheckupComponent } from './medical-checkup.component';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, MedicalCheckupRoutingModule, DxDataGridModule],
  declarations: [MedicalCheckupComponent],
})
export class MedicalCheckupModule {}
