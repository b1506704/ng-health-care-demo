import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalCheckupRoutingModule } from './medical-checkup-routing.module';
import { MedicalCheckupComponent } from './medical-checkup.component';
import {
  DxButtonModule,
  DxFormModule,
  DxHtmlEditorModule,
  DxPopupModule,
  DxScrollViewModule,
  DxSortableModule,
  DxSpeedDialActionModule,
  DxTabPanelModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { PrescriptionViewComponent } from './prescription-view/prescription-view.component';

@NgModule({
  imports: [
    CommonModule,
    MedicalCheckupRoutingModule,
    DxToolbarModule,
    DxTabPanelModule,
    DxHtmlEditorModule,
    DxButtonModule,
    DxSortableModule,
    DxSpeedDialActionModule,
    DxPopupModule,
    DxFormModule,
    DxScrollViewModule,
  ],
  declarations: [MedicalCheckupComponent, PrescriptionViewComponent],
})
export class MedicalCheckupModule {}
