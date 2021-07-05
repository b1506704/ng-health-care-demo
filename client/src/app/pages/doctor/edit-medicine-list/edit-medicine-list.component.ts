import { Component, OnInit } from '@angular/core';
import { Medicine } from 'src/app/shared/models/medicine';
import { MedicineStore } from 'src/app/shared/services/medicine/medicine-store.service';

@Component({
  selector: 'app-edit-medicine-list',
  templateUrl: './edit-medicine-list.component.html',
  styleUrls: ['./edit-medicine-list.component.scss'],
})
export class EditMedicineListComponent implements OnInit {
  medicineList!: Array<Medicine>;
  constructor(private medicineStore: MedicineStore) {}

  onRefresh() {
    this.medicineStore.loadDataAsync();
  }

  onAdd() {}

  ngOnInit(): void {
    this.medicineStore.$medicineList.subscribe((data: any) => {
      this.medicineList = data;
    });
  }
}
