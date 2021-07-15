import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineListRoutingModule } from './medicine-list-routing.module';
import { MedicineListComponent } from './medicine-list.component';
import { DxButtonModule, DxScrollViewModule, DxSpeedDialActionModule, DxToolbarModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, MedicineListRoutingModule, DxScrollViewModule, DxToolbarModule, DxButtonModule, DxSpeedDialActionModule],
  declarations: [MedicineListComponent],
})
export class MedicineListModule {}
