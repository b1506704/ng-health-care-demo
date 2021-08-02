import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Prescription } from 'src/app/shared/models/prescription';
import { MedicalCheckupStore } from 'src/app/shared/services/medical-checkup/medical-checkup-store.service';
import { PrescriptionStore } from 'src/app/shared/services/prescription/prescription-store.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-prescription-editor',
  templateUrl: './prescription-editor.component.html',
  styleUrls: ['./prescription-editor.component.scss'],
})
export class PrescriptionEditorComponent
  implements OnInit, OnDestroy, OnChanges
{
  constructor(
    private medicalCheckupStore: MedicalCheckupStore,
    private store: StoreService,
    private prescriptionStore: PrescriptionStore
  ) {}
  @Input() selectedPrescription: any;
  pageSize: number = 20;
  currentPrescriptionPage: number;
  currentPrescription: Prescription;
  selectedIndex: number = 0;
  prescriptionList: Array<Prescription> = [];
  currentTabList: Array<any> = [];

  insertPrescription() {
    this.selectedIndex = this.currentTabList.length;
    this.currentTabList.push(this.prescriptionList[0]);
    console.log('CURRENT TAB LIST');
    console.log(this.currentTabList);
  }

  insertSelectedPrescription(prescription: any) {
    if (
      !this.currentTabList.find(
        (e) => e.medicalCheckupID === prescription.medicalCheckupID
      )
    ) {
      this.selectedIndex = this.currentTabList.length;
      this.currentTabList.push(prescription);
    }
    console.log('CURRENT TAB LIST');
    console.log(this.currentTabList);
  }

  closeButtonHandler(itemData: any) {
    const index = this.currentTabList.indexOf(itemData);

    this.currentTabList.splice(index, 1);
    if (index >= this.currentTabList.length && index > 0)
      this.selectedIndex = index - 1;
  }

  showCloseButton() {
    return this.currentTabList.length > 1;
  }

  disableButton() {
    return this.currentTabList.length === this.prescriptionList.length;
  }

  onTabDragStart(e: any) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onTabDrop(e: any) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

  prescriptionPageListener() {
    return this.prescriptionStore.$currentPage.subscribe((data: any) => {
      this.currentPrescriptionPage = data;
    });
  }

  prescriptionDataListener() {
    return this.prescriptionStore.$prescriptionList.subscribe((data: any) => {
      this.prescriptionList = data;
      setTimeout(() => {
        this.insertPrescription();
      }, 1000);
    });
  }

  prescriptionInstanceListener() {
    return this.prescriptionStore.$prescriptionInstance.subscribe(
      (data: any) => {
        this.currentPrescription = data;
        console.log('SELECTED PRESCRIPTION');
        console.log(data);
      }
    );
  }

  ngOnInit(): void {
    this.prescriptionPageListener();
    this.prescriptionStore.initInfiniteData(0, this.pageSize).then(() => {
      this.prescriptionDataListener();
      // setTimeout(() => {
      //   this.insertPrescription();
      // }, 1500);
    });
  }

  ngOnChanges(): void {
    if (this.selectedPrescription) {
      console.log('SELECTED COMPLETED CHECKUP');
      console.log(this.selectedPrescription);
      this.prescriptionStore
        .getPrescriptionByMedicalCheckupID(this.selectedPrescription._id)
        .then(() => {
          this.prescriptionInstanceListener();
          // setTimeout(() => {
          this.insertSelectedPrescription(this.currentPrescription);
          // }, 1500);
        });
    }
  }

  ngOnDestroy(): void {
    this.prescriptionPageListener().unsubscribe();
    this.prescriptionDataListener().unsubscribe();
    this.prescriptionInstanceListener().unsubscribe();
  }
}
