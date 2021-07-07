import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medicine } from '../../models/medicine';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { MedicineHttpService } from './medicine-http.service';
import { confirm } from 'devextreme/ui/dialog';

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
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  refresh() {
    this.setIsLoading(true);
    this.medicineService.fetchMedicine().subscribe({
      next: (data: any) => {
        this.setState({ medicineList: data });
        console.log(data);
        this.store.showNotif('Refresh successfully', 'custom');
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
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
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService.uploadMedicine(medicine).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.setIsLoading(false);
            this.loadDataAsync();
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  updateMedicine(medicine: Medicine, key: string) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService.updateMedicine(medicine, key).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.setIsLoading(false);
            this.loadDataAsync();
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  confirmDialog() {
    return confirm('<b>Are you sure?</b>', 'Confirm changes');
  }

  generateRandomNumber() {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService.generateRandomMedicine().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.setIsLoading(false);
            this.loadDataAsync();
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  deleteSelectedMedicines(selectedMedicines: Array<string>) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService
          .deleteSelectedMedicines(selectedMedicines)
          .subscribe({
            next: (data: any) => {
              this.setState({ responseMsg: data });
              console.log(data);
              this.setIsLoading(false);
              this.loadDataAsync();
              this.store.showNotif(data.message, 'custom');
            },
            error: (data: any) => {
              this.setIsLoading(false);
              this.store.showNotif(data.error.errorMessage, 'error');
              console.log(data);
            },
          });
      }
    });
  }

  deleteMedicine(id: string) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService.deleteMedicine(id).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.setIsLoading(false);
            this.loadDataAsync();
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  selectMedicine(_medicine: Medicine) {
    this.setState({ selectedMedicine: _medicine });
  }

  getMedicine(id: string | number) {
    return this.$medicineList.pipe(
      map(
        (medicines: Array<Medicine>) =>
          medicines.find((medicine) => medicine._id === id)!
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
