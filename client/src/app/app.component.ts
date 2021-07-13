import { Component, HostBinding, OnInit } from '@angular/core';
import {
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  Router,
} from '@angular/router';
import { AppInfoService } from './shared/services/app-info.service';
import { ScreenService } from './shared/services/screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes)
      .filter((cl) => this.screen.sizes[cl])
      .join(' ');
  }

  lazyLoading!: boolean;

  constructor(
    private screen: ScreenService,
    public appInfo: AppInfoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.lazyLoading = false;

    this.router.events.subscribe((event: any): void => {
      if (event instanceof RouteConfigLoadStart) {
        this.lazyLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.lazyLoading = false;
      }
    });
  }
}
