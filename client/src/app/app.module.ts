import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule } from './layouts';
import { AppRoutingModule } from './app-routing.module';
import { ScreenService } from './shared/services/screen.service';
import { AppInfoService } from './shared/services/app-info.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SideNavOuterToolbarModule, AppRoutingModule],
  providers: [ScreenService, AppInfoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
