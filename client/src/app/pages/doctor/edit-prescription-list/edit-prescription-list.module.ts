import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPrescriptionListRoutingModule } from './edit-prescription-list-routing.module';
import { EditPrescriptionListComponent } from './edit-prescription-list.component';

@NgModule({
  imports: [CommonModule, EditPrescriptionListRoutingModule],
  declarations: [EditPrescriptionListComponent],
})
export class EditPrescriptionListModule {}
