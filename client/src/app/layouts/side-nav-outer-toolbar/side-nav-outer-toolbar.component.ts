import { Component, OnInit, NgModule, Input, ViewChild } from '@angular/core';
import {
  SideNavigationMenuModule,
  HeaderModule,
} from '../../shared/components';
import { ItemClickEvent } from 'devextreme/ui/tree_view';
import { DxDrawerModule } from 'devextreme-angular/ui/drawer';
import {
  DxScrollViewModule,
  DxScrollViewComponent,
} from 'devextreme-angular/ui/scroll-view';
import { CommonModule } from '@angular/common';

import { Router, NavigationEnd } from '@angular/router';
import { ScreenService } from 'src/app/shared/services/screen.service';
import { DxToastModule } from 'devextreme-angular';
import { UserStore } from 'src/app/shared/services/user/user-store.service';

@Component({
  selector: 'app-side-nav-outer-toolbar',
  templateUrl: './side-nav-outer-toolbar.component.html',
  styleUrls: ['./side-nav-outer-toolbar.component.scss'],
})
export class SideNavOuterToolbarComponent implements OnInit {
  @ViewChild(DxScrollViewComponent, { static: false })
  scrollView!: DxScrollViewComponent;
  selectedRoute = '';

  menuOpened: boolean = false;

  isNotifVisible!: Boolean;
  notifType: string = 'info';
  responseMsg: String = 'OK';
  isSideMenuVisible: boolean = false;

  temporaryMenuOpened = false;

  @Input()
  title!: string;

  menuMode = 'overlap';
  menuRevealMode = 'expand';
  minMenuSize = 0;
  shaderEnabled = false;

  constructor(
    private screen: ScreenService,
    private router: Router,
    private userStore: UserStore
  ) {}

  ngOnInit() {
    // this.updateDrawer();
    this.userStore.$isLoggedIn.subscribe((data: any) => {
      this.isSideMenuVisible = data;
      if (data === false) {
        this.temporaryMenuOpened = false;
        this.menuOpened = false;
      }
      console.log('IS LOGGED IN');
      console.log(data);
    });
    this.menuOpened = this.screen.sizes['screen-large'];

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.selectedRoute = val.urlAfterRedirects.split('?')[0];
      }
    });

    this.screen.changed.subscribe(() => this.updateDrawer());

    this.updateDrawer();
  }

  updateDrawer() {
    const isXSmall = this.screen.sizes['screen-x-small'];
    const isLarge = this.screen.sizes['screen-large'];

    this.menuMode = isLarge ? 'overlap' : 'overlap';
    this.menuRevealMode = isXSmall ? 'slide' : 'expand';
    this.minMenuSize = 0;
    // if (this.isSideMenuVisible) {
    //   this.minMenuSize = isXSmall ? 0 : 60;
    // } else {
    //   this.minMenuSize = 0;
    // }
    this.shaderEnabled = !isLarge;
  }

  get hideMenuAfterNavigation() {
    return this.menuMode === 'overlap' || this.temporaryMenuOpened;
  }

  get showMenuAfterClick() {
    return !this.menuOpened;
  }

  navigationChanged(event: ItemClickEvent) {
    const path = event.itemData.path;
    const pointerEvent = event.event;

    if (path && this.menuOpened) {
      if (event.node?.selected) {
        pointerEvent?.preventDefault();
      } else {
        this.router.navigate([path]);
        this.scrollView.instance.scrollTo(0);
      }

      if (this.hideMenuAfterNavigation) {
        this.temporaryMenuOpened = false;
        this.menuOpened = false;
        pointerEvent?.stopPropagation();
      }
    } else {
      pointerEvent?.preventDefault();
    }
  }

  navigationClick() {
    if (this.showMenuAfterClick) {
      this.temporaryMenuOpened = true;
      this.menuOpened = true;
    }
  }
}

@NgModule({
  imports: [
    SideNavigationMenuModule,
    DxDrawerModule,
    HeaderModule,
    DxScrollViewModule,
    CommonModule,
    DxToastModule,
  ],
  exports: [SideNavOuterToolbarComponent],
  declarations: [SideNavOuterToolbarComponent],
})
export class SideNavOuterToolbarModule {}
