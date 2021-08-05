import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerHomeComponent } from './customer-home.component';
import { CustomerHomeRoutingModule } from './customer-home-routing.module';
import { DxGalleryModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    CustomerHomeRoutingModule,
    DxGalleryModule,
    DxButtonModule,
  ],
  declarations: [CustomerHomeComponent],
})
export class CustomerHomeModule {}
