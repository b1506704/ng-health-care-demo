import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionDetailRoutingModule } from './condition-detail-routing.module';
import { ConditionDetailComponent } from './condition-detail.component';
import {
  DxCircularGaugeModule,
  DxLinearGaugeModule,
  DxListModule,
  DxSpeedDialActionModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:80', options: {} };

@NgModule({
  imports: [
    CommonModule,
    ConditionDetailRoutingModule,
    DxLinearGaugeModule,
    DxCircularGaugeModule,
    DxListModule,
    DxToolbarModule,
    DxSpeedDialActionModule,
    SocketIoModule.forRoot(config),
  ],
  declarations: [ConditionDetailComponent],
})
export class ConditionDetailModule {}
