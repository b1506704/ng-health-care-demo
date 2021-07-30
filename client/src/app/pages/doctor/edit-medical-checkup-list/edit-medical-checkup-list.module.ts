import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMedicalCheckupListRoutingModule } from './edit-medical-checkup-list-routing.module';
import { EditMedicalCheckupListComponent } from './edit-medical-checkup-list.component';
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
import { DiagnoseEditorComponent } from './diagnose-editor/diagnose-editor.component';

@NgModule({
  imports: [
    CommonModule,
    EditMedicalCheckupListRoutingModule,
    DxToolbarModule,
    DxButtonModule,
    DxBoxModule,
    DxSortableModule,
    DxSpeedDialActionModule,
    DxPopupModule,
    DxFormModule,
    DxScrollViewModule,
  ],
  declarations: [EditMedicalCheckupListComponent, DiagnoseEditorComponent],
})
export class EditMedicalCheckupListModule {}
