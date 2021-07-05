import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medicine } from '../../models/medicine';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { MedicineHttpService } from './medicine-http.service';

interface MedicineState {
  medicineList: Array<Medicine>;
  filteredMedicineList: Array<Medicine>;
  searchedMedicineList: Array<Medicine>;
  selectedMedicine: Object;
  responseMsg: String;
}
const initialState: MedicineState = {
  medicineList: [],
  filteredMedicineList: [],
  searchedMedicineList: [],
  selectedMedicine: {},
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class MedicineStore extends StateService<MedicineState> {
  constructor(
    private medicineService: MedicineHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.medicineService.fetchMedicine().subscribe({
      next: (data: any) => {
        this.setState({ medicineList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotifSuccess('Load medicine successfully', 'custom');
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $medicineList: Observable<Array<Medicine>> = this.select(
    (state) => state.medicineList
  );

  $filteredMedicineList: Observable<Array<Medicine>> = this.select(
    (state) => state.filteredMedicineList
  );

  $searchedMedicineList: Observable<Array<Medicine>> = this.select(
    (state) => state.searchedMedicineList
  );

  $selectedMedicine: Observable<Object> = this.select(
    (state) => state.selectedMedicine
  );

  uploadMedicine(medicine: Medicine) {
    this.setIsLoading(true);
    this.medicineService.uploadMedicine(medicine).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  updateMedicine(medicine: Medicine) {
    this.setIsLoading(true);
    this.medicineService.updateMedicine(medicine).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  deleteMedicine(medicine: Medicine) {
    this.setIsLoading(true);
    this.medicineService.deleteMedicine(medicine).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  selectMedicine(_medicine: Medicine) {
    this.setState({ selectedMedicine: _medicine });
  }

  getMedicine(id: string | number) {
    return this.$medicineList.pipe(
      map(
        (medicines: Array<Medicine>) =>
          medicines.find((medicine) => medicine.id === id)!
      )
    );
  }

  filterMedicine(_medicineList: Array<Medicine>, _criteria: string) {
    this.setState({ filteredMedicineList: _medicineList });
  }

  searchMedicine(_medicineList: Array<Medicine>, _criteria: string) {
    this.setState({ searchedMedicineList: _medicineList });
  }
}
