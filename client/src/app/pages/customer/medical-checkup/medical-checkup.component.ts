import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxFormComponent, DxScrollViewComponent } from 'devextreme-angular';
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
export class MedicalCheckupComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @ViewChild(DxScrollViewComponent, { static: false })
  scrollView: DxScrollViewComponent;
  constructor(
    private router: Router,
    private medicalCheckupStore: MedicalCheckupStore,
    private store: StoreService,
    private customerStore: CustomerStore
  ) {}
  pageSize: number = 10;
  updateContentTimer: any;
  currentIndexFromServer: number;
  isSearchingByName: boolean;
  timeout: any;
  currentSearchByNameValue: string;
  searchBoxOptions: any = {
    valueChangeEvent: 'keyup',
    showClearButton: true,
    onKeyUp: this.onSearchKeyupHandler.bind(this),
    onValueChanged: this.onSearchValueChanged.bind(this),
    mode: 'search',
    placeholder: 'Search with name',
  };
  refreshButtonOptions: any = {
    type: 'normal',
    icon: 'refresh',
    hint: 'Fetch data from server',
    onClick: this.onRefresh.bind(this),
  };
  pendingList: Array<MedicalCheckup>;
  completeList: Array<MedicalCheckup>;
  checkUpData: Array<MedicalCheckup>;
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

  updateContent = (args: any, eventName: any) => {
    const editorMode = this.checkEditorMode();
    const currentIndex = this.currentIndexFromServer;
    if (this.updateContentTimer) clearTimeout(this.updateContentTimer);
    this.updateContentTimer = setTimeout(() => {
      if (this.checkUpData.length) {
        switch (editorMode) {
          case 'NORMAL':
            this.paginatePureData(currentIndex + 1);
            break;
          case 'SEARCH':
            this.paginateSearchData(currentIndex + 1);
            break;
          default:
            break;
        }
      }
      args.component.release();
    }, 500);
  };

  updateTopContent = (e: any) => {
    this.updateContent(e, 'PullDown');
  };

  updateBottomContent = (e: any) => {
    this.updateContent(e, 'ReachBottom');
  };

  onSearchKeyupHandler(e: any) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.isSearchingByName = true;
      console.log(this.currentSearchByNameValue);
      if (this.currentSearchByNameValue !== '') {
        this.medicalCheckupStore.initInfiniteSearchByNameData(
          this.currentSearchByNameValue,
          0,
          this.pageSize
        );
      } else {
        //return to pure editor mode
        this.store.showNotif('SEARCH MODE OFF', 'custom');
        this.onRefresh();
      }
    }, 1250);
  }

  checkEditorMode() {
    if (this.isSearchingByName === true) {
      return 'SEARCH';
    } else {
      return 'NORMAL';
    }
  }

  paginatePureData(index: number) {
    this.medicalCheckupStore.loadInfiniteDataAsync(index, this.pageSize);
  }

  paginateSearchData(index: number) {
    this.medicalCheckupStore.searchInfiniteMedicalCheckupByName(
      this.currentSearchByNameValue,
      index,
      this.pageSize
    );
  }

  onSearchValueChanged(e: any) {
    this.currentSearchByNameValue = e.value;
  }

  onRefresh() {
    this.isSearchingByName = false;
    this.medicalCheckupStore.initInfiniteData(0, this.pageSize);
  }

  resetValues() {
    this.checkUpDetail = {
      doctorID: '',
      customerID: this.customerData._id,
      customerName: this.customerData.fullName,
      prescriptionID: '',
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
    this.medicalCheckupStore.uploadMedicalCheckup(this.checkUpDetail, 0, 5);
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
              prescriptionID: '',
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

  medicalCheckupDataListener() {
    return this.medicalCheckupStore.$medicalCheckupList.subscribe(
      (data: Array<MedicalCheckup>) => {
        this.checkUpData = data;
        setTimeout(() => {
          this.pendingList = this.checkUpData.filter(
            (e) => e.status === 'pending'
          );
        }, 150);
        setTimeout(() => {
          this.completeList = this.checkUpData.filter(
            (e) => e.status === 'complete'
          );
        }, 150);
      }
    );
  }

  currentPageListener() {
    return this.medicalCheckupStore.$currentPage.subscribe((data: any) => {
      this.currentIndexFromServer = data;
    });
  }

  scrollTop() {
    this.scrollView.instance.scrollTo({ top: 0, left: 0 });
  }

  navigateToHealthCondition() {
    this.router.navigate(['/health_condition']);
  }

  ngOnInit(): void {
    this.medicalCheckupStore.initInfiniteData(0, this.pageSize);
    this.getPatientID();
    this.medicalCheckupDataListener();
    this.currentPageListener();
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
    this.medicalCheckupDataListener().unsubscribe();
  }
}
