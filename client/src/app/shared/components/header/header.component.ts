import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPanelModule } from '../user-panel/user-panel.component';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { Router } from '@angular/router';
import { DxLoadIndicatorModule, DxProgressBarModule } from 'devextreme-angular';
import { StoreService } from '../../services/store.service';
import { UserStore } from '../../services/user/user-store.service';
import { User } from '../../models/user';
import { ScreenService } from '../../services/screen.service';
@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  userMenuItems = [
    {
      text: 'Profile',
      icon: 'user',
      onClick: () => {
        this.router.navigate(['/profile']);
      },
    },
  ];

  isLoadIndicatorVisible!: boolean;
  isLoggedIn!: boolean;
  currentUser!: User;
  eventType: string = '';
  progress!: number;
  maxValue: number = 100;
  responsiveWidth: any;

  constructor(
    private router: Router,
    private store: StoreService,
    private userStore: UserStore,
    private screenService: ScreenService
  ) {}

  responsiveAdapt() {
    const isXSmall = this.screenService.sizes['screen-x-small'];
    const isSmall = this.screenService.sizes['screen-small'];
    if (isXSmall === true) {
      this.responsiveWidth = 100;
    } else if (isSmall === true) {
      this.responsiveWidth = 120;
    } else {
      this.responsiveWidth = 300;
    }
  }

  loadingDataListener() {
    return this.store.$isLoading.subscribe((data: any) => {
      this.isLoadIndicatorVisible = data;
    });
  }

  responseProgressListener() {
    return this.store.$responseProgress.subscribe((data: any) => {
      if (data !== undefined) {
        this.progress = data;
        console.log('RECEIVED PROGRESS');
        console.log(this.progress);
      }
    });
  }

  responseEventTypeListener() {
    return this.store.$responseEventType.subscribe((data: any) => {
      if (data !== undefined) {
        this.eventType = data;
        console.log('EVENT TYPE');
        console.log(this.eventType);
      }
    });
  }

  userDataListener() {
    return this.store.$currentUser.subscribe((data: any) => {
      if (data !== null) {
        this.currentUser = data;
      }
    });
  }

  navigateByRole() {
    return this.userStore.$isLoggedIn.subscribe((data: any) => {
      this.isLoggedIn = data;
      if (this.isLoggedIn) {
        this.store.$currentRole.subscribe((data: string) => {
          switch (data.trim().toLocaleLowerCase()) {
            case 'admin':
              this.router.navigate(['/admin_home']);
              break;
            case 'doctor':
              this.router.navigate(['/doctor_home']);
              break;
            case 'customer':
              this.router.navigate(['/customer_home']);
              break;
            default:
              this.router.navigate(['/doctor_home']);
              break;
          }
        });
      } else {
        this.onLogin();
      }
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }

  onLogout() {
    this.userStore.logoutUser(this.currentUser);
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  };

  format(value: number) {
    return `Loading: ${(value * 100).toFixed(2)}%`;
  }

  ngOnInit(): void {
    this.loadingDataListener();
    this.responseProgressListener();
    this.responseEventTypeListener();
    this.navigateByRole();
    this.userDataListener();
    this.responsiveAdapt();
  }

  ngOnDestroy(): void {
    this.navigateByRole().unsubscribe();
    this.userDataListener().unsubscribe();
    this.loadingDataListener().unsubscribe();
    this.responseProgressListener().unsubscribe();
    this.responseEventTypeListener().unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    UserPanelModule,
    DxToolbarModule,
    DxLoadIndicatorModule,
    DxProgressBarModule,
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule {}
