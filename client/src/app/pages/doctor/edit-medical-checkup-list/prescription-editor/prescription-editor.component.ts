import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

import { Prescription } from 'src/app/shared/models/prescription';
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
  valueType: string = 'string';
  saveButtonOptions: any = {
    type: 'normal',
    icon: 'save',
    hint: 'Submit report',
    onClick: this.updatePrescription.bind(this),
  };
  exportPDFButtonOptions: any = {
    type: 'normal',
    icon: 'exportpdf',
    hint: 'Export to PDF',
    onClick: this.exportPDF.bind(this),
  };

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

  htmlEditorValueChanged(e: any) {
    this.currentTabList[this.selectedIndex].htmlMarkUp = e;
    console.log(this.currentTabList[this.selectedIndex].htmlMarkUp);
  }

  exportPDF() {
    const doc = new jsPDF();
    const html = htmlToPdfmake(
      this.currentTabList[this.selectedIndex].htmlMarkUp
    );
    const documentDefinition = { content: html };
    pdfMake
      .createPdf(documentDefinition)
      .download(`${this.currentTabList[this.selectedIndex].customerName}`);
    console.log(html);
    this.store.showNotif(
      `Exported ${this.currentTabList[this.selectedIndex].customerName}.pdf`,
      'custom'
    );
  }

  updatePrescription() {
    const currentID = this.currentTabList[this.selectedIndex]._id;
    console.log('UPDATED PRESCRIPTION ID');
    console.log(currentID);
    this.prescriptionStore.updatePrescription(
      this.currentTabList[this.selectedIndex],
      currentID,
      0,
      this.pageSize
    );
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
          this.insertSelectedPrescription(this.currentPrescription);
        });
    }
  }

  ngOnDestroy(): void {
    this.prescriptionPageListener().unsubscribe();
    this.prescriptionDataListener().unsubscribe();
    this.prescriptionInstanceListener().unsubscribe();
  }
}
