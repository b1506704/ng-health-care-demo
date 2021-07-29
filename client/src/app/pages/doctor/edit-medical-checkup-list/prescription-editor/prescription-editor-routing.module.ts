import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionEditorRoutingModule } from './prescription-editor.module';
import { PrescriptionEditorComponent } from './prescription-editor.component';
import {
  DxAccordionModule,
  DxBoxModule,
  DxButtonModule,
  DxFormModule,
  DxHtmlEditorModule,
  DxPopupModule,
  DxScrollViewModule,
  DxSortableModule,
  DxSpeedDialActionModule,
  DxToolbarModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    PrescriptionEditorRoutingModule,
    DxToolbarModule,
    DxButtonModule,
    DxBoxModule,
    DxSortableModule,
    DxSpeedDialActionModule,
    DxPopupModule,
    DxFormModule,
    DxScrollViewModule,
  ],
  declarations: [PrescriptionEditorComponent],
})
export class PrescriptionEditorModule {}
