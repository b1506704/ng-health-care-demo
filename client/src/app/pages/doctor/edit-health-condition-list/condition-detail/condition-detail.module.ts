import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxActionSheetModule,
  DxButtonModule,
  DxCircularGaugeModule,
  DxLinearGaugeModule,
  DxPopupModule,
  DxScrollViewModule,
  DxSpeedDialActionModule,
  DxSwitchModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ConditionDetailComponent } from './condition-detail.component';
import { ConditionDetailRoutingModule } from './condition-detail-routing.module';
// const config: SocketIoConfig = { url: 'http://localhost:80', options: {} };
const config: SocketIoConfig = {
  url: 'https://ng-health-care-demo.herokuapp.com',
  options: {},
};
@NgModule({
  imports: [
    CommonModule,
    SocketIoModule.forRoot(config),
    DxCircularGaugeModule,
    DxLinearGaugeModule,
    ConditionDetailRoutingModule,
    DxSpeedDialActionModule,
    DxSwitchModule,
    DxPopupModule,
    DxScrollViewModule,
    DxTextBoxModule,
    DxButtonModule,
    DxActionSheetModule
  ],
  declarations: [ConditionDetailComponent],
})
export class ConditionDetailModule {}
