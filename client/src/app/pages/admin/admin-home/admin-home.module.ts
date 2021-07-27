import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { AdminHomeComponent } from './admin-home.component';
import { DxBoxModule, DxButtonModule, DxGalleryModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, AdminHomeRoutingModule,DxGalleryModule, DxBoxModule, DxButtonModule],
  declarations: [AdminHomeComponent],
})
export class AdminHomeModule {}
