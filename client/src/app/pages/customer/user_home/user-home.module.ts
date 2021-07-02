import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHomeComponent } from './user-home.component';
import { UserHomeRoutingModule } from './user-home-routing.module';

@NgModule({
  imports: [CommonModule, UserHomeRoutingModule],
  declarations: [UserHomeComponent],
})
export class UserHomeModule {}
