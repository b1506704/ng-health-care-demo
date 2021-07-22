import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule } from './layouts';
import { AppRoutingModule } from './app-routing.module';
import { ScreenService } from './shared/services/screen.service';
import { AppInfoService } from './shared/services/app-info.service';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './pages/doctor/edit-health-condition-list/edit-health-condition-list.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ScreenService, AppInfoService, { provide: RouteReuseStrategy, useClass: CustomReuseStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
