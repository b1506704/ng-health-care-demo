import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { User } from '../../models/user';
import { DxFormComponent } from 'devextreme-angular';
import { CustomerStore } from '../../services/customer/customer-store.service';
import { DoctorStore } from '../../services/doctor/doctor-store.service';
import { Customer } from '../../models/customer';
@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  submitButtonOptions: any = {
    text: 'Submit',
    icon: 'save',
    type: 'normal',
    useSubmitBehavior: true,
  };
  resetButtonOptions: any = {
    text: 'Reset',
    icon: 'refresh',
    type: 'normal',
    useSubmitBehavior: false,
    onClick: () => {
      this.form.instance.resetValues();
      this.form.instance.getEditor('userName').focus();
    },
  };
  submitCustomerButtonOptions: any = {
    text: 'Submit',
    icon: 'save',
    type: 'normal',
    useSubmitBehavior: true,
  };
  resetCustomerButtonOptions: any = {
    text: 'Reset',
    icon: 'refresh',
    type: 'normal',
    useSubmitBehavior: false,
    onClick: () => {
      this.renderSourceData();
    },
  };
  submitDoctorButtonOptions: any = {
    text: 'Submit',
    icon: 'save',
    type: 'normal',
    useSubmitBehavior: true,
  };
  resetDoctorButtonOptions: any = {
    text: 'Reset',
    icon: 'refresh',
    type: 'normal',
    useSubmitBehavior: false,
    onClick: () => {
      this.renderSourceData();
    },
  };
  user!: any;
  customerData!: Customer;
  doctorData!: any;
  currentUser!: User;
  currentRole!: string;

  constructor(
    private store: StoreService,
    private customerStore: CustomerStore,
    private doctorStore: DoctorStore
  ) {}

  onFormShown(e: any) {
    setTimeout(() => {
      this.form.instance.getEditor('userName').focus();
    }, 200);
  }

  onSubmit = (e: any) => {
    e.preventDefault();
  };

  onCustomerSubmit = (e: any) => {
    e.preventDefault();
    this.customerStore.updateCustomer(
      this.customerData,
      this.customerData._id,
      0,
      5
    );
  };

  onDoctorSubmit = (e: any) => {
    e.preventDefault();
    this.doctorStore.updateDoctor(this.doctorData, this.doctorData._id, 0, 5);
  };

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
      this.customerData = data;
    });
  }

  doctorDataListener() {
    return this.doctorStore.$doctorInstance.subscribe((data: any) => {
      this.doctorData = data;
    });
  }

  renderSourceData() {
    this.user = this.currentUser;
    switch (this.currentRole) {
      case 'Customer':
        this.customerStore
          .getCustomerByUserName(this.currentUser.userName)
          .then(() => {
            this.customerDataListener();
          });
        this.user = {
          userName: this.user.userName,
          passWord: this.user.passWord,
          role: this.user.role,
        };
        break;
      case 'Doctor':
        this.doctorStore
          .getDoctorByUserName(this.currentUser.userName)
          .then(() => {
            this.doctorDataListener();
          });
        this.user = {
          userName: this.user.userName,
          passWord: this.user.passWord,
          role: this.user.role,
        };
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
  }
}
