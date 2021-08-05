import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { AdminHomeComponent } from './admin-home.component';
import { DxButtonModule, DxGalleryModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    AdminHomeRoutingModule,
    DxGalleryModule,
    DxButtonModule,
  ],
  declarations: [AdminHomeComponent],
})
export class AdminHomeModule {}
