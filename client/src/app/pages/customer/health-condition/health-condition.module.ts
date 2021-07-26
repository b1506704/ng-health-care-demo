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
import { HealthConditionComponent } from './health-condition.component';
import { HealthConditionRoutingModule } from './health-condition-routing.module';
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
    HealthConditionRoutingModule,
    DxSpeedDialActionModule,
    DxSwitchModule,
    DxPopupModule,
    DxScrollViewModule,
    DxTextBoxModule,
    DxButtonModule,
    DxActionSheetModule
  ],
  declarations: [HealthConditionComponent],
})
export class HealthConditionModule {}
