import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerHomeComponent } from './customer-home.component';
import { CustomerHomeRoutingModule } from './customer-home-routing.module';
import {
  DxGalleryModule,
  DxBoxModule,
  DxButtonModule,
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    CustomerHomeRoutingModule,
    DxGalleryModule,
    DxBoxModule,
    DxButtonModule,
  ],
  declarations: [CustomerHomeComponent],
})
export class CustomerHomeModule {}
