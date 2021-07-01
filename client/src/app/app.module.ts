import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule } from './layouts';
import { ScreenService, AppInfoService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SideNavOuterToolbarModule, AppRoutingModule],
  providers: [ScreenService, AppInfoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
