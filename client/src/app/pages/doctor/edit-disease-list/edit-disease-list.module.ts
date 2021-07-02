import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDiseaseListComponent } from './edit-disease-list.component';
import { EditDiseaseListRoutingModule } from './edit-disease-list-routing.module';

@NgModule({
  imports: [CommonModule, EditDiseaseListRoutingModule],
  declarations: [EditDiseaseListComponent],
})
export class EditDiseaseListModule {}
