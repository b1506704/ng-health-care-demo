import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Disease } from 'src/app/shared/models/disease';
import { Doctor } from 'src/app/shared/models/doctor';
import { Medicine } from 'src/app/shared/models/medicine';
import { DiseaseStore } from 'src/app/shared/services/disease/disease-store.service';
import { MedicineStore } from 'src/app/shared/services/medicine/medicine-store.service';
import { PrescriptionStore } from 'src/app/shared/services/prescription/prescription-store.service';
import { StoreService } from 'src/app/shared/services/store.service';
import predefineMarkupTemplate from 'src/app/utils/predefineMarkupTemplate';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-diagnose-editor',
  templateUrl: './diagnose-editor.component.html',
  styleUrls: ['./diagnose-editor.component.scss'],
})
export class DiagnoseEditorComponent implements OnInit, OnDestroy {
  constructor(
    private store: StoreService,
    private medicineStore: MedicineStore,
    private diseaseStore: DiseaseStore,
    private prescriptionStore: PrescriptionStore
  ) {}
  @Input() doctorData: Doctor;
  @Input() checkUpDetail: any;
  isMedicineDragging: boolean = false;
  isDiseaseDragging: boolean = false;
  pageSize: number = 20;
  updateMedicineContentTimer: any;
  updateDiseaseContentTimer: any;
  currentCheckupMedicinePage: number;
  currentCheckupDiseasePage: number;
  isSearchingMedicineByName: boolean;
  isSearchingDiseaseByName: boolean;
  medicineTimeout: any;
  diseaseTimeout: any;
  currentSearchMedicineByNameValue: string;
  currentSearchDiseaseByNameValue: string;
  searchMedicineBoxOptions: any = {
    valueChangeEvent: 'keyup',
    showClearButton: true,
    onKeyUp: this.onMedicineSearchKeyupHandler.bind(this),
    onValueChanged: this.onMedicineSearchValueChanged.bind(this),
    mode: 'search',
    placeholder: ' ',
  };
  refreshMedicineButtonOptions: any = {
    type: 'normal',
    icon: 'refresh',
    hint: 'Fetch data from server',
    onClick: this.onMedicineRefresh.bind(this),
  };
  searchDiseaseBoxOptions: any = {
    valueChangeEvent: 'keyup',
    showClearButton: true,
    onKeyUp: this.onDiseaseSearchKeyupHandler.bind(this),
    onValueChanged: this.onDiseaseSearchValueChanged.bind(this),
    mode: 'search',
    placeholder: ' ',
  };
  refreshDiseaseButtonOptions: any = {
    type: 'normal',
    icon: 'refresh',
    hint: 'Fetch data from server',
    onClick: this.onDiseaseRefresh.bind(this),
  };
  shiftDiagnoseMedicineButtonOptions: any = {
    type: 'normal',
    icon: 'hidepanel',
    hint: 'Remove first item',
    onClick: this.onDiagnoseMedicineShift.bind(this),
  };
  deleteAllDiagnoseMedicineButtonOptions: any = {
    type: 'danger',
    icon: 'trash',
    hint: 'Delete all',
    onClick: this.onDiagnoseMedicineDeleteAll.bind(this),
  };
  shiftDiagnoseDiseaseButtonOptions: any = {
    type: 'normal',
    icon: 'hidepanel',
    hint: 'Remove first item',
    onClick: this.onDiagnoseDiseaseShift.bind(this),
  };
  deleteAllDiagnoseDiseaseButtonOptions: any = {
    type: 'danger',
    icon: 'trash',
    hint: 'Delete all',
    onClick: this.onDiagnoseDiseaseDeleteAll.bind(this),
  };
  sortableHeight: any = '30vh';
  degree: Object = {
    items: ['1', '2', '3', '4'],
    value: '1',
  };
  medicineList: Array<Medicine>;
  diseaseList: Array<Disease>;
  diagnoseMedicineList: Array<Medicine> = [];
  diagnoseDiseaseList: Array<Disease> = [];
  addedMedicine: Medicine;
  addedMedicineIndex: number;
  addedDisease: Disease;
  addedDiseaseIndex: number;
  currentMedicine: any = {
    _id: '',
    name: '',
    price: 0,
    quantity: 0,
    brand: '',
    effect: '',
    advice: '',
  };
  currentDisease: any = {
    _id: '',
    name: '',
    description: '',
    degree: '',
  };
  isDiagnosePopupVisible: boolean = false;
  isMedicinePopupVisible: boolean = false;
  isDiseasePopupVisible: boolean = false;
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
    },
  };
  submitMedicineButtonOptions: any = {
    text: 'Save',
    icon: 'save',
    type: 'normal',
    useSubmitBehavior: true,
  };
  resetMedicineButtonOptions: any = {
    text: 'Reset',
    icon: 'refresh',
    type: 'normal',
    useSubmitBehavior: false,
    onClick: () => {
      this.resetMedicineValues();
    },
  };
  submitDiseaseButtonOptions: any = {
    text: 'Save',
    icon: 'save',
    type: 'normal',
    useSubmitBehavior: true,
  };
  resetDiseaseButtonOptions: any = {
    text: 'Reset',
    icon: 'refresh',
    type: 'normal',
    useSubmitBehavior: false,
    onClick: () => {
      this.resetDiseaseValues();
    },
  };

  onDiagnoseMedicineShift() {
    confirm('<b>Are you sure?</b>', 'Delete Medicine').then(
      (confirm: boolean) => {
        if (confirm) {
          this.diagnoseMedicineList.shift();
          this.store.showNotif('Remove first item', 'custom');
        }
      }
    );
  }

  onDiagnoseMedicineDeleteAll() {
    confirm('<b>Are you sure?</b>', 'Delete Medicine').then(
      (confirm: boolean) => {
        if (confirm) {
          this.diagnoseMedicineList = [];
          this.store.showNotif('Remove all item', 'custom');
        }
      }
    );
  }

  editMedicine(item: any) {
    this.addedMedicineIndex = this.diagnoseMedicineList.indexOf(item);
    this.currentMedicine = item;
    this.isMedicinePopupVisible = true;
  }

  deleteMedicine(item: any) {
    confirm('<b>Are you sure?</b>', 'Delete Medicine').then(
      (confirm: boolean) => {
        if (confirm) {
          this.diagnoseMedicineList = this.diagnoseMedicineList.filter(
            (e) => e._id !== item._id
          );
          this.store.showNotif(`Remove ${item.name}`, 'custom');
        }
      }
    );
  }

  onDiagnoseDiseaseShift() {
    confirm('<b>Are you sure?</b>', 'Delete Disease').then(
      (confirm: boolean) => {
        if (confirm) {
          this.diagnoseDiseaseList.shift();
          this.store.showNotif('Remove first item', 'custom');
        }
      }
    );
  }

  onDiagnoseDiseaseDeleteAll() {
    confirm('<b>Are you sure?</b>', 'Delete Disease').then(
      (confirm: boolean) => {
        if (confirm) {
          this.diagnoseDiseaseList = [];
          this.store.showNotif('Remove all item', 'custom');
        }
      }
    );
  }

  editDisease(item: any) {
    this.addedDiseaseIndex = this.diagnoseDiseaseList.indexOf(item);
    this.currentDisease = item;
    this.isDiseasePopupVisible = true;
  }

  deleteDisease(item: any) {
    confirm('<b>Are you sure?</b>', 'Delete Disease').then(
      (confirm: boolean) => {
        if (confirm) {
          this.diagnoseDiseaseList = this.diagnoseDiseaseList.filter(
            (e) => e._id !== item._id
          );
          this.store.showNotif(`Remove ${item.name}`, 'custom');
        }
      }
    );
  }

  onMedicineSubmit(e: any) {
    e.preventDefault();
    this.currentMedicine.totalCost =
      this.currentMedicine.quantity * this.currentMedicine.price;
    if (this.currentMedicine.quantity >= 1) {
      this.diagnoseMedicineList[this.addedMedicineIndex] = this.currentMedicine;
      this.store.showNotif(
        `Added ${this.currentMedicine.quantity} item(s) of ${this.currentMedicine.name}`,
        'custom'
      );
      console.log('SAVED MEDICINE');
      console.log(this.diagnoseMedicineList[this.addedMedicineIndex]);
      this.isMedicinePopupVisible = false;
    } else {
      this.store.showNotif('Please check pill quantity', 'custom');
    }
  }

  resetMedicineValues() {
    this.currentMedicine = {
      _id: this.addedMedicine._id,
      name: this.addedMedicine.name,
      price: this.addedMedicine.price,
      quantity: 0,
      totalCost: 0,
      brand: this.addedMedicine.brand,
      effect: this.addedMedicine.effect,
      advice: '',
    };
  }
  // init data for medicine popup
  setCurrentMedicine() {
    this.currentMedicine = {
      _id: this.addedMedicine._id,
      name: this.addedMedicine.name,
      price: this.addedMedicine.price,
      quantity: 1,
      totalCost: this.addedMedicine.price,
      brand: this.addedMedicine.brand,
      effect: this.addedMedicine.effect,
      advice: 'No further notice',
    };
  }

  onDiseaseSubmit(e: any) {
    e.preventDefault();
    this.diagnoseDiseaseList[this.addedDiseaseIndex] = this.currentDisease;
    this.store.showNotif(`Added ${this.currentDisease.name}`, 'custom');
    console.log('SAVED DISEASE');
    console.log(this.diagnoseDiseaseList[this.addedDiseaseIndex]);
    this.isDiseasePopupVisible = false;
  }

  resetDiseaseValues() {
    this.currentDisease = {
      _id: this.addedDisease._id,
      name: this.addedDisease.name,
      description: this.addedDisease.description,
      degree: '1',
    };
  }
  // init data for disease popup
  setCurrentDisease() {
    this.currentDisease = {
      _id: this.addedDisease._id,
      name: this.addedDisease.name,
      description: this.addedDisease.description,
      degree: '1',
    };
  }

  // -- Medicine Checkup Functions --

  updateMedicineContent = (args: any, eventName: any) => {
    const editorMode = this.checkMedicineEditorMode();
    const currentIndex = this.currentCheckupMedicinePage;
    if (this.updateMedicineContentTimer)
      clearTimeout(this.updateMedicineContentTimer);
    this.updateMedicineContentTimer = setTimeout(() => {
      if (this.medicineList.length) {
        switch (editorMode) {
          case 'NORMAL':
            this.paginateMedicinePureData(currentIndex + 1);
            break;
          case 'SEARCH':
            this.paginateMedicineSearchData(currentIndex + 1);
            break;
          default:
            break;
        }
      }
      args.component.release();
    }, 500);
  };

  updateMedicineTopContent = (e: any) => {
    this.updateMedicineContent(e, 'PullDown');
  };

  updateMedicineBottomContent = (e: any) => {
    this.updateMedicineContent(e, 'ReachBottom');
  };

  onMedicineSearchKeyupHandler(e: any) {
    clearTimeout(this.medicineTimeout);
    this.medicineTimeout = setTimeout(() => {
      this.isSearchingMedicineByName = true;
      console.log(this.currentSearchMedicineByNameValue);
      if (this.currentSearchMedicineByNameValue !== '') {
        this.medicineStore.initInfiniteSearchByNameData(
          this.currentSearchMedicineByNameValue,
          0,
          this.pageSize
        );
      } else {
        //return to pure editor mode
        this.store.showNotif('SEARCH MODE OFF', 'custom');
        this.onMedicineRefresh();
      }
    }, 1250);
  }

  checkMedicineEditorMode() {
    if (this.isSearchingMedicineByName === true) {
      return 'SEARCH';
    } else {
      return 'NORMAL';
    }
  }

  paginateMedicinePureData(index: number) {
    this.medicineStore.loadInfiniteDataAsync(index, this.pageSize);
  }

  paginateMedicineSearchData(index: number) {
    this.medicineStore.searchInfiniteMedicineByName(
      this.currentSearchMedicineByNameValue,
      index,
      this.pageSize
    );
  }

  onMedicineSearchValueChanged(e: any) {
    this.currentSearchMedicineByNameValue = e.value;
  }

  onMedicineRefresh() {
    this.isSearchingMedicineByName = false;
    this.medicineStore.initInfiniteData(0, this.pageSize);
  }

  // -- Disease Checkup Functions --

  updateDiseaseContent = (args: any, eventName: any) => {
    const editorMode = this.checkDiseaseEditorMode();
    const currentIndex = this.currentCheckupDiseasePage;
    if (this.updateDiseaseContentTimer)
      clearTimeout(this.updateDiseaseContentTimer);
    this.updateDiseaseContentTimer = setTimeout(() => {
      if (this.diseaseList.length) {
        switch (editorMode) {
          case 'NORMAL':
            this.paginateDiseasePureData(currentIndex + 1);
            break;
          case 'SEARCH':
            this.paginateDiseaseSearchData(currentIndex + 1);
            break;
          default:
            break;
        }
      }
      args.component.release();
    }, 500);
  };

  updateDiseaseTopContent = (e: any) => {
    this.updateDiseaseContent(e, 'PullDown');
  };

  updateDiseaseBottomContent = (e: any) => {
    this.updateDiseaseContent(e, 'ReachBottom');
  };

  onDiseaseSearchKeyupHandler(e: any) {
    clearTimeout(this.diseaseTimeout);
    this.diseaseTimeout = setTimeout(() => {
      this.isSearchingDiseaseByName = true;
      console.log(this.currentSearchDiseaseByNameValue);
      if (this.currentSearchDiseaseByNameValue !== '') {
        this.diseaseStore.initInfiniteSearchByNameData(
          this.currentSearchDiseaseByNameValue,
          0,
          this.pageSize
        );
      } else {
        //return to pure editor mode
        this.store.showNotif('SEARCH MODE OFF', 'custom');
        this.onDiseaseRefresh();
      }
    }, 1250);
  }

  checkDiseaseEditorMode() {
    if (this.isSearchingDiseaseByName === true) {
      return 'SEARCH';
    } else {
      return 'NORMAL';
    }
  }

  paginateDiseasePureData(index: number) {
    this.diseaseStore.loadInfiniteDataAsync(index, this.pageSize);
  }

  paginateDiseaseSearchData(index: number) {
    this.diseaseStore.searchInfiniteDiseaseByName(
      this.currentSearchDiseaseByNameValue,
      index,
      this.pageSize
    );
  }

  onDiseaseSearchValueChanged(e: any) {
    this.currentSearchDiseaseByNameValue = e.value;
  }

  onDiseaseRefresh() {
    this.isSearchingDiseaseByName = false;
    this.diseaseStore.initInfiniteData(0, this.pageSize);
  }

  //handle position change => change priority
  onTaskDragMedicineStart(e: any) {
    e.itemData = e.fromData[e.fromIndex];
    this.isMedicineDragging = true;
    this.store.setIsLoading(true);
  }

  onTaskDiagnoseMedicineDrop(e: any) {
    this.addedMedicine = e.itemData;
    this.addedMedicineIndex = e.toIndex;
    this.setCurrentMedicine();
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
    this.isMedicineDragging = false;
    this.store.setIsLoading(false);
    this.isMedicinePopupVisible = true;
    console.log('DIAGNOSE MEDICINE LIST');
    console.log(this.diagnoseMedicineList);
  }

  onDragMedicineEnd(e: any) {
    this.isMedicineDragging = false;
    this.store.setIsLoading(false);
  }

  onTaskDragDiseaseStart(e: any) {
    e.itemData = e.fromData[e.fromIndex];
    this.isDiseaseDragging = true;
    this.store.setIsLoading(true);
  }

  onDragDiseaseEnd(e: any) {
    this.isDiseaseDragging = false;
    this.store.setIsLoading(false);
  }

  onTaskDiagnoseDiseaseDrop(e: any) {
    this.addedDisease = e.itemData;
    this.addedDiseaseIndex = e.toIndex;
    this.setCurrentDisease();
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
    this.isDiseaseDragging = false;
    this.store.setIsLoading(false);
    this.isDiseasePopupVisible = true;
    console.log('DIAGNOSE DISEASE LIST');
    console.log(this.diagnoseDiseaseList);
  }

  resetValues() {
    this.diagnoseDiseaseList = [];
    this.diagnoseMedicineList = [];
    this.onDiseaseRefresh();
    this.onMedicineRefresh();
  }

  generateMarkupTemplate() {
    const input = {
      customerName: this.checkUpDetail.customerName,
      doctorName: this.doctorData.fullName,
      diseaseList: this.diagnoseDiseaseList,
      medicineList: this.diagnoseMedicineList,
      advice: '',
    };
    return predefineMarkupTemplate(input);
  }

  submitDiagnose() {
    const diagnose = {
      medicalCheckupID: this.checkUpDetail._id,
      customerID: this.checkUpDetail.customerID,
      customerName: this.checkUpDetail.customerName,
      doctorID: this.doctorData._id,
      doctorName: this.doctorData.fullName,
      diseaseList: this.diagnoseDiseaseList,
      medicineList: this.diagnoseMedicineList,
      htmlMarkUp: this.generateMarkupTemplate(),
      advice: '',
    };
    this.prescriptionStore.uploadPrescription(diagnose, 0, this.pageSize);
    this.resetValues();
  }

  medicineCheckupDataListener() {
    return this.medicineStore.$medicineList.subscribe(
      (data: Array<Medicine>) => {
        this.medicineList = data;
      }
    );
  }

  diseaseCheckupDataListener() {
    return this.diseaseStore.$diseaseList.subscribe((data: Array<Disease>) => {
      this.diseaseList = data;
    });
  }

  currentCheckupMedicinePageListener() {
    return this.medicineStore.$currentPage.subscribe((data: any) => {
      this.currentCheckupMedicinePage = data;
    });
  }

  currentCheckupDiseasePageListener() {
    return this.diseaseStore.$currentPage.subscribe((data: any) => {
      this.currentCheckupDiseasePage = data;
    });
  }

  ngOnInit(): void {
    this.currentCheckupMedicinePageListener();
    this.currentCheckupDiseasePageListener();
    this.medicineStore.initInfiniteData(0, this.pageSize).then(() => {
      this.medicineCheckupDataListener();
    });
    this.diseaseStore.initInfiniteData(0, this.pageSize).then(() => {
      this.diseaseCheckupDataListener();
    });
    console.log('CURRENT DIAGNOSE CHECKUP DETAIL');
    console.log(this.checkUpDetail);
  }

  ngOnDestroy(): void {
    this.medicineCheckupDataListener().unsubscribe();
    this.currentCheckupMedicinePageListener().unsubscribe();
    this.currentCheckupDiseasePageListener().unsubscribe();
    this.diseaseCheckupDataListener().unsubscribe();
  }
}
