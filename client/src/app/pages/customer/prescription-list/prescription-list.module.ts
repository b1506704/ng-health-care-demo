import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionListRoutingModule } from './prescription-list-routing.module';
import { PrescriptionListComponent } from './prescription-list.component';

@NgModule({
  imports: [CommonModule, PrescriptionListRoutingModule],
  declarations: [PrescriptionListComponent],
})
export class PrescriptionListModule {}
