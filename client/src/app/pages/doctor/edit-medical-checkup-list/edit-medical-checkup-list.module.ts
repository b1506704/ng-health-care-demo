import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMedicalCheckupListRoutingModule } from './edit-medical-checkup-list-routing.module';
import { EditMedicalCheckupListComponent } from './edit-medical-checkup-list.component';
import {
  DxAccordionModule,
  DxBoxModule,
  DxButtonModule,
  DxHtmlEditorModule,
  DxPopupModule,
  DxSortableModule,
  DxToolbarModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditMedicalCheckupListRoutingModule,
    DxBoxModule,
    DxSortableModule,
    DxPopupModule,
    DxAccordionModule,
    DxHtmlEditorModule,
    DxToolbarModule,
    DxButtonModule
  ],
  declarations: [EditMedicalCheckupListComponent],
})
export class EditMedicalCheckupListModule {}
