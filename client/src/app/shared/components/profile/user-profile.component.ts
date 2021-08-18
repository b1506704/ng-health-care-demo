import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { User } from '../../models/user';
import { DxFormComponent } from 'devextreme-angular';
import { CustomerStore } from '../../services/customer/customer-store.service';
import { DoctorStore } from '../../services/doctor/doctor-store.service';
import { Customer } from '../../models/customer';
import { ImageStore } from '../../services/image/image-store.service';
import { Image } from '../../models/image';
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
      this.imageData.url = '../../../../assets/imgs/profile.png';
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
      this.imageData.url = '../../../../assets/imgs/profile.png';
    },
  };
  user!: any;
  customerData!: Customer;
  doctorData!: any;
  currentUser!: User;
  currentRole!: string;
  imageData: Image = {
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
    this.imageData.sourceID = this.customerData._id;
    this.imageData.category = 'customer';
    this.imageData.title = this.customerData.fullName;
    this.imageStore.uploadImage(this.imageData, 0, 5);
    this.customerStore.updateCustomer(
      this.customerData,
      this.customerData._id,
      0,
      5
    );
  };

  onDoctorSubmit = (e: any) => {
    e.preventDefault();
    this.imageData.sourceID = this.doctorData._id;
    this.imageData.category = 'doctor';
    this.imageData.title = this.doctorData.fullName;
    this.imageStore.uploadImage(this.imageData, 0, 5);
    this.doctorStore.updateDoctor(this.doctorData, this.doctorData._id, 0, 5);
  };

  handleInputChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    console.log(file);
    if (file !== undefined) {
      if (file.size <= 2000000) {
        this.imageData.fileSize = file.size;
        this.imageData.fileType = file.type;
        this.imageData.fileName = file.name;
        var pattern = /image-*/;
        var reader = new FileReader();

        if (!file.type.match(pattern)) {
          this.store.showNotif('Invalid format!', 'custom');
          return;
        }
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
      } else {
        this.store.showNotif('Image cannot exceed 2MB', 'custom');
      }
    }
  }

  handleReaderLoaded(e: any) {
    var reader = e.target;
    console.log('READER');
    console.log(reader);
    this.imageData.url = reader.result;
    console.log('SOURCE ID');
    console.log(this.imageData.sourceID);
  }

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
        this.imageData = data;
      }
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
    this.imageDataListener().unsubscribe();
  }
}
