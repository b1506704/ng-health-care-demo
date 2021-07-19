import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomMonitorRoutingModule } from './room-monitor-routing.module';
import { RoomMonitorComponent } from './room-monitor.component';
import { DxButtonModule, DxScrollViewModule, DxSpeedDialActionModule, DxToolbarModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    RoomMonitorRoutingModule,
    DxToolbarModule,
    DxButtonModule,
    DxScrollViewModule,
    DxSpeedDialActionModule
  ],
  declarations: [RoomMonitorComponent],
})
export class RoomMonitorModule {}
