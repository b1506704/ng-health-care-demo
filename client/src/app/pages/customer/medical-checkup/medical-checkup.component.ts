import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxFormComponent } from 'devextreme-angular';
import { Customer } from 'src/app/shared/models/customer';
import { MedicalCheckup } from 'src/app/shared/models/medical-checkup';
import { CustomerStore } from 'src/app/shared/services/customer/customer-store.service';
import { MedicalCheckupStore } from 'src/app/shared/services/medical-checkup/medical-checkup-store.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-medical-checkup',
  templateUrl: './medical-checkup.component.html',
  styleUrls: ['./medical-checkup.component.scss'],
})
export class MedicalCheckupComponent implements OnInit, OnDestroy {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  constructor(
    private router: Router,
    private medicalCheckupStore: MedicalCheckupStore,
    private store: StoreService,
    private customerStore: CustomerStore
  ) {}
  pageSize: number = 10;
  updatePendingContentTimer: any;
  updateCompleteContentTimer: any;
  currentCheckupPendingPage: number;
  currentCheckupCompletePage: number;
  isSearchingPendingByName: boolean;
  isSearchingCompleteByName: boolean;
  pendingTimeout: any;
  completeTimeout: any;
  currentSearchPendingByNameValue: string;
  currentSearchCompleteByNameValue: string;
  searchPendingBoxOptions: any = {
    valueChangeEvent: 'keyup',
    showClearButton: true,
    onKeyUp: this.onPendingSearchKeyupHandler.bind(this),
    onValueChanged: this.onPendingSearchValueChanged.bind(this),
    mode: 'search',
    placeholder: 'Search with purpose',
  };
  refreshPendingButtonOptions: any = {
    type: 'normal',
    icon: 'refresh',
    hint: 'Fetch data from server',
    onClick: this.onPendingRefresh.bind(this),
  };
  searchCompleteBoxOptions: any = {
    valueChangeEvent: 'keyup',
    showClearButton: true,
    onKeyUp: this.onCompleteSearchKeyupHandler.bind(this),
    onValueChanged: this.onCompleteSearchValueChanged.bind(this),
    mode: 'search',
    placeholder: 'Search with purpose',
  };
  refreshCompleteButtonOptions: any = {
    type: 'normal',
    icon: 'refresh',
    hint: 'Fetch data from server',
    onClick: this.onCompleteRefresh.bind(this),
  };
  pendingList: Array<MedicalCheckup>;
  completeList: Array<MedicalCheckup>;
  colCountByScreen: Object;
  isCheckUpPopupVisible: boolean = false;
  checkUpDetail: MedicalCheckup;
  customerData: Customer;
  location: Object = {
    items: ['T1', 'T2', 'T3'],
    value: 'T1',
  };
  healthInsurance: Object = {
    items: ['YES', 'NO'],
    value: 'NO',
  };
  submitButtonOptions: any = {
    text: 'Submit',
    type: 'normal',
    useSubmitBehavior: true,
  };
  resetButtonOptions: any = {
    text: 'Clear',
    type: 'normal',
    useSubmitBehavior: false,
    onClick: () => {
      this.resetValues();
      this.form.instance.getEditor('purpose').focus();
    },
  };

  // -- Pending Checkup Functions --

  updatePendingContent = (args: any, eventName: any) => {
    const editorMode = this.checkPendingEditorMode();
    const currentIndex = this.currentCheckupPendingPage;
    if (this.updatePendingContentTimer)
      clearTimeout(this.updatePendingContentTimer);
    this.updatePendingContentTimer = setTimeout(() => {
      if (this.pendingList.length) {
        switch (editorMode) {
          case 'NORMAL':
            this.paginatePendingPureData(currentIndex + 1);
            break;
          case 'SEARCH':
            this.paginatePendingSearchData(currentIndex + 1);
            break;
          default:
            break;
        }
      }
      args.component.release();
    }, 500);
  };

  updatePendingTopContent = (e: any) => {
    this.updatePendingContent(e, 'PullDown');
  };

  updatePendingBottomContent = (e: any) => {
    this.updatePendingContent(e, 'ReachBottom');
  };

  onPendingSearchKeyupHandler(e: any) {
    clearTimeout(this.pendingTimeout);
    this.pendingTimeout = setTimeout(() => {
      this.isSearchingPendingByName = true;
      console.log(this.currentSearchPendingByNameValue);
      if (this.currentSearchPendingByNameValue !== '') {
        this.medicalCheckupStore.initPendingInfiniteSearchByNameData(
          this.currentSearchPendingByNameValue,
          0,
          this.pageSize
        );
      } else {
        //return to pure editor mode
        this.store.showNotif('SEARCH MODE OFF', 'custom');
        this.onPendingRefresh();
      }
    }, 1250);
  }

  checkPendingEditorMode() {
    if (this.isSearchingPendingByName === true) {
      return 'SEARCH';
    } else {
      return 'NORMAL';
    }
  }

  paginatePendingPureData(index: number) {
    this.medicalCheckupStore.loadPendingInfiniteDataAsync(index, this.pageSize);
  }

  paginatePendingSearchData(index: number) {
    this.medicalCheckupStore.searchPendingInfiniteMedicalCheckupByName(
      this.currentSearchPendingByNameValue,
      index,
      this.pageSize
    );
  }

  onPendingSearchValueChanged(e: any) {
    this.currentSearchPendingByNameValue = e.value;
  }

  onPendingRefresh() {
    this.isSearchingPendingByName = false;
    this.medicalCheckupStore.initPendingInfiniteData(0, this.pageSize);
  }

  // -- Complete Checkup Functions --

  updateCompleteContent = (args: any, eventName: any) => {
    const editorMode = this.checkCompleteEditorMode();
    const currentIndex = this.currentCheckupCompletePage;
    if (this.updateCompleteContentTimer)
      clearTimeout(this.updateCompleteContentTimer);
    this.updateCompleteContentTimer = setTimeout(() => {
      if (this.completeList.length) {
        switch (editorMode) {
          case 'NORMAL':
            this.paginateCompletePureData(currentIndex + 1);
            break;
          case 'SEARCH':
            this.paginateCompleteSearchData(currentIndex + 1);
            break;
          default:
            break;
        }
      }
      args.component.release();
    }, 500);
  };

  updateCompleteTopContent = (e: any) => {
    this.updateCompleteContent(e, 'PullDown');
  };

  updateCompleteBottomContent = (e: any) => {
    this.updateCompleteContent(e, 'ReachBottom');
  };

  onCompleteSearchKeyupHandler(e: any) {
    clearTimeout(this.completeTimeout);
    this.completeTimeout = setTimeout(() => {
      this.isSearchingCompleteByName = true;
      console.log(this.currentSearchCompleteByNameValue);
      if (this.currentSearchCompleteByNameValue !== '') {
        this.medicalCheckupStore.initCompleteInfiniteSearchByNameData(
          this.currentSearchCompleteByNameValue,
          0,
          this.pageSize
        );
      } else {
        //return to pure editor mode
        this.store.showNotif('SEARCH MODE OFF', 'custom');
        this.onCompleteRefresh();
      }
    }, 1250);
  }

  checkCompleteEditorMode() {
    if (this.isSearchingCompleteByName === true) {
      return 'SEARCH';
    } else {
      return 'NORMAL';
    }
  }

  paginateCompletePureData(index: number) {
    this.medicalCheckupStore.loadCompleteInfiniteDataAsync(
      index,
      this.pageSize
    );
  }

  paginateCompleteSearchData(index: number) {
    this.medicalCheckupStore.searchCompleteInfiniteMedicalCheckupByName(
      this.currentSearchCompleteByNameValue,
      index,
      this.pageSize
    );
  }

  onCompleteSearchValueChanged(e: any) {
    this.currentSearchCompleteByNameValue = e.value;
  }

  onCompleteRefresh() {
    this.isSearchingCompleteByName = false;
    this.medicalCheckupStore.initCompleteInfiniteData(0, this.pageSize);
  }

  resetValues() {
    this.checkUpDetail = {
      doctorID: '',
      customerID: this.customerData._id,
      customerName: this.customerData.fullName,
      priority: 0,
      healthInsurance: '',
      location: '',
      purpose: '',
      status: 'pending',
      startDate: new Date(),
    };
  }

  onSignupSubmit = (e: any) => {
    console.log(this.checkUpDetail);
    e.preventDefault();
    this.medicalCheckupStore.uploadMedicalCheckup(
      this.checkUpDetail,
      0,
      this.pageSize
    );
    this.isCheckUpPopupVisible = false;
    this.resetValues();
  };

  onTaskDragStart(e: any) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onTaskDrop(e: any) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

  newCheckup() {
    this.isCheckUpPopupVisible = true;
    setTimeout(() => {
      this.form.instance.getEditor('purpose').focus();
    }, 500);
  }

  getPatientID() {
    return this.store.$currentUser.subscribe((data: any) => {
      if (data) {
        console.log('LOGGED IN USER:');
        console.log(data);
        this.customerStore.getCustomerByUserName(data.userName).then(() => {
          this.customerStore.$customerInstance.subscribe((data: any) => {
            this.customerData = data;
            console.log('CURRENT CUSTOMER:');
            console.log(data);
            this.checkUpDetail = {
              doctorID: '',
              customerID: data._id,
              customerName: data.fullName,
              priority: 0,
              healthInsurance: '',
              location: '',
              purpose: '',
              status: 'pending',
              startDate: new Date(),
            };
          });
        });
      }
    });
  }

  pendingCheckupDataListener() {
    return this.medicalCheckupStore.$pendingCheckupList.subscribe(
      (data: Array<MedicalCheckup>) => {
        this.pendingList = data;
      }
    );
  }

  completeCheckupDataListener() {
    return this.medicalCheckupStore.$completeCheckupList.subscribe(
      (data: Array<MedicalCheckup>) => {
        this.completeList = data;
      }
    );
  }

  currentCheckupPendingPageListener() {
    return this.medicalCheckupStore.$currentCheckupPendingPage.subscribe(
      (data: any) => {
        this.currentCheckupPendingPage = data;
      }
    );
  }

  currentCheckupCompletePageListener() {
    return this.medicalCheckupStore.$currentCheckupCompletePage.subscribe(
      (data: any) => {
        this.currentCheckupCompletePage = data;
      }
    );
  }

  navigateToHealthCondition() {
    this.router.navigate(['/health_condition']);
  }

  ngOnInit(): void {
    this.currentCheckupPendingPageListener();
    this.currentCheckupCompletePageListener();
    this.medicalCheckupStore
      .initPendingInfiniteData(0, this.pageSize)
      .then(() => {
        this.pendingCheckupDataListener();
      });
    this.medicalCheckupStore
      .initCompleteInfiniteData(0, this.pageSize)
      .then(() => {
        this.completeCheckupDataListener();
      });
    this.getPatientID();
  }

  screen(width: any) {
    return width < 720 ? 'sm' : 'md';
  }

  ngOnDestroy(): void {
    this.colCountByScreen = {
      md: 4,
      sm: 2,
    };
    this.getPatientID().unsubscribe();
    this.pendingCheckupDataListener().unsubscribe();
    this.currentCheckupPendingPageListener().unsubscribe();
    this.currentCheckupCompletePageListener().unsubscribe();
    this.completeCheckupDataListener().unsubscribe();
  }
}
