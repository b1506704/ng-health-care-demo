import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMedicalCheckupListRoutingModule } from './edit-medical-checkup-list-routing.module';
import { EditMedicalCheckupListComponent } from './edit-medical-checkup-list.component';
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
import { DiagnoseEditorComponent } from './diagnose-editor/diagnose-editor.component';
import { PrescriptionEditorComponent } from './prescription-editor/prescription-editor.component';
import { FormatCurrencyModule } from 'src/app/shared/pipes/formatCurrency.module';

@NgModule({
  imports: [
    CommonModule,
    EditMedicalCheckupListRoutingModule,
    DxToolbarModule,
    DxButtonModule,
    DxTabPanelModule,
    DxHtmlEditorModule,
    DxSortableModule,
    DxSpeedDialActionModule,
    DxPopupModule,
    DxFormModule,
    FormatCurrencyModule,
    DxScrollViewModule,
  ],
  declarations: [
    EditMedicalCheckupListComponent,
    DiagnoseEditorComponent,
    PrescriptionEditorComponent,
  ],
})
export class EditMedicalCheckupListModule {}
