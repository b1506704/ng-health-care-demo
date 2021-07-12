import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDiseaseListComponent } from './edit-disease-list.component';
import { EditDiseaseListRoutingModule } from './edit-disease-list-routing.module';
import {
  DxDataGridModule,
  DxToolbarModule,
  DxButtonModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    EditDiseaseListRoutingModule,
    DxDataGridModule,
    DxToolbarModule,
    DxButtonModule,
  ],
  declarations: [EditDiseaseListComponent],
})
export class EditDiseaseListModule {}
