import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPanelModule } from '../user-panel/user-panel.component';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { Router } from '@angular/router';
import { DxLoadIndicatorModule } from 'devextreme-angular';
import { StoreService } from '../../services/store.service';
import { UserStore } from '../../services/user/user-store.service';
import { User } from '../../models/user';
@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
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
  isLoggedIn!: boolean ;
  currentUser!: User;

  constructor(
    private router: Router,
    private store: StoreService,
    private userStore: UserStore
  ) {}

  ngOnInit() {
    this.store.$isLoading.subscribe((data: any) => {
      this.isLoadIndicatorVisible = data;
    });
    this.store.$currentUser.subscribe((data: any) => {
      if (data !== null) {
        this.currentUser = data;
      }
      // console.log(data);
    });
    this.userStore.$isLoggedIn.subscribe((data: any) => {
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
}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    UserPanelModule,
    DxToolbarModule,
    DxLoadIndicatorModule,
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule {}
