import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnoseEditorRoutingModule } from './diagnose-editor-routing.module';
import { DiagnoseEditorComponent } from './diagnose-editor.component';
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
    DiagnoseEditorRoutingModule,
    DxToolbarModule,
    DxButtonModule,
    DxBoxModule,
    DxSortableModule,
    DxSpeedDialActionModule,
    DxPopupModule,
    DxFormModule,
    DxScrollViewModule,
  ],
  declarations: [DiagnoseEditorComponent],
})
export class DiagnoseEditorModule {}
