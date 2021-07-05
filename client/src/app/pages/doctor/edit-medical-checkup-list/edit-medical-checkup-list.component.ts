import { Component, OnInit } from '@angular/core';
import { Medicine } from 'src/app/shared/models/medicine';
import { MedicineStore } from 'src/app/shared/services/medicine/medicine-store.service';

@Component({
  selector: 'app-edit-medical-checkup-list',
  templateUrl: './edit-medical-checkup-list.component.html',
  styleUrls: ['./edit-medical-checkup-list.component.scss'],
})
export class EditMedicalCheckupListComponent implements OnInit {
  medicineList!: Array<Medicine>;
  constructor(private medicineStore: MedicineStore) {}

  ngOnInit(): void {
    this.medicineStore.$medicineList.subscribe((data: any) => {
      this.medicineList = data;
    });
  }
}
