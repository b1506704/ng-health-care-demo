import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMedicalCheckupListRoutingModule } from './edit-medical-checkup-list-routing.module';
import { EditMedicalCheckupListComponent } from './edit-medical-checkup-list.component';
import {
  DxBoxModule,
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
import { DiagnoseEditorComponent } from './diagnose-editor/diagnose-editor.component';
import { PrescriptionEditorComponent } from './prescription-editor/prescription-editor.component';

@NgModule({
  imports: [
    CommonModule,
    EditMedicalCheckupListRoutingModule,
    DxToolbarModule,
    DxButtonModule,
    DxTabPanelModule,
    DxBoxModule,
    DxHtmlEditorModule,
    DxSortableModule,
    DxSpeedDialActionModule,
    DxPopupModule,
    DxFormModule,
    DxScrollViewModule,
  ],
  declarations: [
    EditMedicalCheckupListComponent,
    DiagnoseEditorComponent,
    PrescriptionEditorComponent,
  ],
})
export class EditMedicalCheckupListModule {}
