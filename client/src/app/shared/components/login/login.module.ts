import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { DxFormModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, LoginRoutingModule, DxFormModule],
  declarations: [LoginComponent],
})
export class LoginModule {}
