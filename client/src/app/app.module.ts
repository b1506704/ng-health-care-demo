import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/services/auth-interceptor.service';
import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule } from './layouts';
import { AppRoutingModule } from './app-routing.module';
import { ScreenService } from './shared/services/screen.service';
import { AppInfoService } from './shared/services/app-info.service';
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
  providers: [
    ScreenService,
    AppInfoService,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
