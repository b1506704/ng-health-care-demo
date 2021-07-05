import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { DxBoxModule, DxFormModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, LoginRoutingModule, DxFormModule, DxBoxModule],
  declarations: [LoginComponent],
})
export class LoginModule {}
