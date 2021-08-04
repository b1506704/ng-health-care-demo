import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserProfileRoutingModule } from './edit-user-profile-routing.module';
import { EditUserProfileComponent } from './edit-user-profile.component';
import { DxFormModule } from 'devextreme-angular';

@NgModule({
  imports: [CommonModule, EditUserProfileRoutingModule, DxFormModule],
  declarations: [EditUserProfileComponent],
})
export class EditUserProfileModule {}
