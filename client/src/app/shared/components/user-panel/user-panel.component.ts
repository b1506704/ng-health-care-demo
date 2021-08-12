import { Component, NgModule, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { StoreService } from '../../services/store.service';
import { User } from '../../models/user';
import { Image } from '../../models/image';
import { ImageStore } from '../../services/image/image-store.service';
import { Customer } from '../../models/customer';
import { CustomerStore } from '../../services/customer/customer-store.service';
import { DoctorStore } from '../../services/doctor/doctor-store.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit, OnDestroy {
  @Input()
  menuItems: any;

  @Input()
  menuMode!: string;
  // user!: any;
  customerData!: Customer;
  doctorData!: any;
  currentUser!: User;
  currentRole!: string;
  userImage: Image = {
    sourceID: '',
    category: '',
    title: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    url: '../../../../assets/imgs/profile.png',
  };

  constructor(
    private store: StoreService,
    private customerStore: CustomerStore,
    private doctorStore: DoctorStore,
    private imageStore: ImageStore
  ) {}

  userDataListener() {
    return this.store.$currentUser.subscribe((data: any) => {
      if (data !== null) {
        this.currentUser = data;
      }
    });
  }

  userRoleListener() {
    return this.store.$currentRole.subscribe((data: any) => {
      this.currentRole = data;
    });
  }

  customerDataListener() {
    return this.customerStore.$customerInstance.subscribe((data: any) => {
      if (data !== undefined) {
        this.customerData = data;
        this.imageStore.getImageBySourceID(data._id).then(() => {
          this.imageDataListener();
        });
      }
    });
  }

  doctorDataListener() {
    return this.doctorStore.$doctorInstance.subscribe((data: any) => {
      if (data !== undefined) {
        this.doctorData = data;
        this.imageStore.getImageBySourceID(data._id).then(() => {
          this.imageDataListener();
        });
      }
    });
  }

  imageDataListener() {
    return this.imageStore.$imageInstance.subscribe((data: any) => {
      if (data !== null) {
        console.log('IMAGE DATA');
        console.log(data);
        this.userImage = data;
      }
    });
  }

  renderSourceData() {
    switch (this.currentRole) {
      case 'Customer':
        this.customerStore
          .getCustomerByUserName(this.currentUser.userName)
          .then(() => {
            this.customerDataListener();
          });
        break;
      case 'Doctor':
        this.doctorStore
          .getDoctorByUserName(this.currentUser.userName)
          .then(() => {
            this.doctorDataListener();
          });
        break;
      default:
        break;
    }
  }
  ngOnInit(): void {
    this.userDataListener();
    this.userRoleListener();
    this.renderSourceData();
  }
  ngOnDestroy(): void {
    this.userDataListener().unsubscribe();
    this.userRoleListener().unsubscribe();
    this.imageDataListener().unsubscribe();
  }
}

@NgModule({
  imports: [DxListModule, DxContextMenuModule, CommonModule],
  declarations: [UserPanelComponent],
  exports: [UserPanelComponent],
})
export class UserPanelModule {}
