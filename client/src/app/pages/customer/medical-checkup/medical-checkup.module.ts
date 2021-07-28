import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalCheckupRoutingModule } from './medical-checkup-routing.module';
import { MedicalCheckupComponent } from './medical-checkup.component';
import {
  DxBoxModule,
  DxButtonModule,
  DxFormModule,
  DxPopupModule,
  DxScrollViewModule,
  DxSortableModule,
  DxSpeedDialActionModule,
  DxToolbarModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    MedicalCheckupRoutingModule,
    DxToolbarModule,
    DxButtonModule,
    DxBoxModule,
    DxSortableModule,
    DxSpeedDialActionModule,
    DxPopupModule,
    DxFormModule,
    DxScrollViewModule
  ],
  declarations: [MedicalCheckupComponent],
})
export class MedicalCheckupModule {}
