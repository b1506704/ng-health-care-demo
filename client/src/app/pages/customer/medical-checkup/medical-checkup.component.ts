import { Component, OnInit } from '@angular/core';
import { Medicine } from 'src/app/shared/models/medicine';
import { MedicineStore } from 'src/app/shared/services/medicine/medicine-store.service';

@Component({
  selector: 'app-medical-checkup',
  templateUrl: './medical-checkup.component.html',
  styleUrls: ['./medical-checkup.component.scss'],
})
export class MedicalCheckupComponent implements OnInit {
  medicineList!: Array<Medicine>;
  constructor(private medicineStore: MedicineStore) {}

  ngOnInit(): void {
    this.medicineStore.$medicineList.subscribe((data: any) => {
      this.medicineList = data;
    });
  }
}
