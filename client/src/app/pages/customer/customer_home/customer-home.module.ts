import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerHomeComponent } from './customer-home.component';
import { CustomerHomeRoutingModule } from './customer-home-routing.module';

@NgModule({
  imports: [CommonModule, CustomerHomeRoutingModule],
  declarations: [CustomerHomeComponent],
})
export class CustomerHomeModule {}
