import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Medicine } from 'src/app/shared/models/medicine';
import formatCurrency from 'src/app/utils/formatCurrency';
import { MedicineStore } from '../../../../shared/services/medicine/medicine-store.service';
@Component({
  selector: 'app-medicine-detail',
  templateUrl: 'medicine-detail.component.html',
  styleUrls: ['./medicine-detail.component.scss'],
})
export class MedicineDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() medicineID!: string;
  medicineData!: Medicine;
  price!: string;

  constructor(private medicineStore: MedicineStore) {}

  medicineDataListener() {
    return this.medicineStore.$medicineInstance.subscribe((data: any) => {
      this.medicineData = data;
      // setTimeout(() => {
      this.price = formatCurrency(this.medicineData.price, '$');
      // }, 100);
    });
  }

  renderSourceData() {
    this.medicineData = null;
    this.price = null;
    setTimeout(() => {
      this.medicineStore.getMedicine(this.medicineID).then(() => {
        this.medicineDataListener();
      });
    }, 100);
  }

  formatCurrency() {
    return formatCurrency(this.medicineData.price, '$');
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.renderSourceData();
  }

  ngOnDestroy(): void {
    this.medicineDataListener().unsubscribe();
  }
}
