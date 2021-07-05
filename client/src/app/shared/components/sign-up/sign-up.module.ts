import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { SignUpComponent } from './sign-up.component';
import { DxBoxModule, DxFormModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, SignUpRoutingModule, DxFormModule, DxBoxModule],
  declarations: [SignUpComponent],
})
export class SignUpModule {}
