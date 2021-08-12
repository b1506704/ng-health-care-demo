import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/shared/models/doctor';
import { MedicalCheckup } from 'src/app/shared/models/medical-checkup';
import { DoctorStore } from 'src/app/shared/services/doctor/doctor-store.service';
import { MedicalCheckupStore } from 'src/app/shared/services/medical-checkup/medical-checkup-store.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-edit-medical-checkup-list',
  templateUrl: './edit-medical-checkup-list.component.html',
  styleUrls: ['./edit-medical-checkup-list.component.scss'],
})
export class EditMedicalCheckupListComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private medicalCheckupStore: MedicalCheckupStore,
    private store: StoreService,
    private doctorStore: DoctorStore
  ) {}
  isPendingDragging: boolean = false;
  isCompleteDragging: boolean = false;
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
    placeholder: ' ',
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
    placeholder: ' ',
  };
  refreshCompleteButtonOptions: any = {
    type: 'normal',
    icon: 'refresh',
    hint: 'Fetch data from server',
    onClick: this.onCompleteRefresh.bind(this),
  };
  pendingList: Array<MedicalCheckup>;
  completeList: Array<MedicalCheckup>;
  selectedPrescription: any;
  isDiagnosePopupVisible: boolean = false;
  checkUpDetail: any;
  doctorData: Doctor;

  selectPrescription(prescription: any) {
    this.selectedPrescription = prescription;
    console.log(prescription);
  }

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

  //handle position change => change priority
  onTaskDragPendingStart(e: any) {
    e.itemData = e.fromData[e.fromIndex];
    this.isPendingDragging = true;
    this.store.setIsLoading(true);
  }

  onTaskPendingDrop(e: any) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
    this.isPendingDragging = false;
    this.store.setIsLoading(false);
  }

  onDragPendingEnd(e: any) {
    this.isPendingDragging = false;
    this.store.setIsLoading(false);
  }

  onTaskPendingReorder(e: any) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
    this.isPendingDragging = false;
    this.store.setIsLoading(false);
  }

  onTaskDragCompleteStart(e: any) {
    e.itemData = e.fromData[e.fromIndex];
    this.isCompleteDragging = true;
    this.store.setIsLoading(true);
  }

  onTaskCompleteDrop(e: any) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
    console.log('CURRENT ON CHECK CUSTOMER');
    console.log(e.itemData);
    this.checkUpDetail = e.itemData;
    this.isCompleteDragging = false;
    this.store.setIsLoading(false);
    this.isDiagnosePopupVisible = true;
    this.prescriptionDoneListener();
  }

  onTaskCompleteReorder(e: any) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
    this.isCompleteDragging = false;
    this.store.setIsLoading(false);
  }

  onDragCompleteEnd(e: any) {
    this.isCompleteDragging = false;
    this.store.setIsLoading(false);
  }

  getDoctorID() {
    return this.store.$currentUser.subscribe((data: any) => {
      if (data) {
        console.log('LOGGED IN USER:');
        console.log(data);
        this.doctorStore.getDoctorByUserName(data.userName).then(() => {
          this.doctorStore.$doctorInstance.subscribe((data: any) => {
            this.doctorData = data;
            console.log('CURRENT DOCTOR:');
            console.log(data);
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

  prescriptionDoneListener() {
    return this.medicalCheckupStore.$isPrescriptionDone.subscribe(
      (data: boolean) => {
        setTimeout(() => {
          if (data === true) {
            this.isDiagnosePopupVisible = false;
            this.selectPrescription(this.completeList[0]);
            this.medicalCheckupStore.setIsPrescriptionDone(false);
          }
        }, 1000);
      }
    );
  }

  navigateToScheduleList() {
    this.router.navigate(['/schedule_list']);
  }

  screen(width: any) {
    return ( width < 451 ) ? 'sm' : 'lg';
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
    this.getDoctorID();
  }

  ngOnDestroy(): void {
    this.getDoctorID().unsubscribe();
    this.prescriptionDoneListener().unsubscribe();
    this.pendingCheckupDataListener().unsubscribe();
    this.currentCheckupPendingPageListener().unsubscribe();
    this.currentCheckupCompletePageListener().unsubscribe();
    this.completeCheckupDataListener().unsubscribe();
  }
}
