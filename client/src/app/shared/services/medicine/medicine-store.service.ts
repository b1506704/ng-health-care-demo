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
  totalPages: Number;
  currentPage: Number;
  totalItems: Number;
  responseMsg: String;
}
const initialState: MedicineState = {
  medicineList: [],
  filteredMedicineList: [],
  searchedMedicineList: [],
  selectedMedicine: {},
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
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
    // this.medicineService.fetchMedicine(0, 5).subscribe((data: any) => {
    //   this.setState({medicineList: new Array<Medicine>(data.totalItems)});
    //   this.setState({ totalItems: data.totalItems });
    //   this.setState({ totalPages: data.totalPages });
    //   this.setState({ currentPage: data.currentPage });
    //   this.loadDataAsync(0, 5);
    // });
    this.loadDataAsync(1, 5);
    this.loadDataAsync(2, 5);
    this.loadDataAsync(3, 5);
    this.loadDataAsync(4, 5);
    this.loadDataAsync(5, 5);
  }

  checkDuplicate(sourceArray: Array<Medicine>, addedArray: Array<Medicine>) {
    var a = sourceArray.concat(addedArray);
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        // if (a[i] === undefined) return false;
        if (a[i]._id === a[j]._id) return true;
      }
    }
    return false;
  }

  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.medicineService.fetchMedicine(page, size).subscribe({
      next: (data: any) => {
        if (!this.checkDuplicate(this.state.medicineList, data.items)) {
          this.setState({
            medicineList: this.state.medicineList.concat(data.items),
          });
          this.setState({ totalItems: data.totalItems });
          this.setState({ totalPages: data.totalPages });
          this.setState({ currentPage: data.currentPage });
        }
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

  refresh(page: number, size: number) {
    this.setIsLoading(true);
    this.medicineService.fetchMedicine(page, size).subscribe({
      next: (data: any) => {
        if (!this.checkDuplicate(this.state.medicineList, data.items)) {
          this.setState({
            medicineList: this.state.medicineList.concat(data.items),
          });
          this.setState({ totalItems: data.totalItems });
          this.setState({ totalPages: data.totalPages });
          this.setState({ currentPage: data.currentPage });
        }
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

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $filteredMedicineList: Observable<Array<Medicine>> = this.select(
    (state) => state.filteredMedicineList
  );

  $searchedMedicineList: Observable<Array<Medicine>> = this.select(
    (state) => state.searchedMedicineList
  );

  $selectedMedicine: Observable<Object> = this.select(
    (state) => state.selectedMedicine
  );

  uploadMedicine(medicine: Medicine, page: number, size: number) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService.uploadMedicine(medicine).subscribe({
          next: (data: any) => {
            this.setState({ medicineList: data.items });
            this.setState({ totalItems: data.totalItems });
            this.setState({ totalPages: data.totalPages });
            this.setState({ currentPage: data.currentPage });
            this.setState({ responseMsg: data });
            console.log(data);
            this.setIsLoading(false);
            this.loadDataAsync(page, size);
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

  updateMedicine(medicine: Medicine, key: string, page: number, size: number) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService.updateMedicine(medicine, key).subscribe({
          next: (data: any) => {
            this.setState({ medicineList: data.items });
            this.setState({ totalItems: data.totalItems });
            this.setState({ totalPages: data.totalPages });
            this.setState({ currentPage: data.currentPage });
            this.setState({ responseMsg: data });
            console.log(data);
            this.setIsLoading(false);
            this.loadDataAsync(page, size);
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
  // need rework
  generateRandomNumber() {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService.generateRandomMedicine().subscribe({
          next: (data: any) => {
            this.setState({ medicineList: data.items });
            this.setState({ totalItems: data.totalItems });
            this.setState({ totalPages: data.totalPages });
            this.setState({ currentPage: data.currentPage });
            this.setState({ responseMsg: data });
            console.log(data);
            this.setIsLoading(false);
            this.loadDataAsync(1, 5);
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

  deleteSelectedMedicines(
    selectedMedicines: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService
          .deleteSelectedMedicines(selectedMedicines)
          .subscribe({
            next: (data: any) => {
              this.setState({ medicineList: data.items });
              this.setState({ totalItems: data.totalItems });
              this.setState({ totalPages: data.totalPages });
              this.setState({ currentPage: data.currentPage });
              this.setState({ responseMsg: data });
              console.log(data);
              this.setIsLoading(false);
              this.loadDataAsync(page, size);
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

  deleteMedicine(id: string, page: number, size: number) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService.deleteMedicine(id).subscribe({
          next: (data: any) => {
            this.setState({ medicineList: data.items });
            this.setState({ totalItems: data.totalItems });
            this.setState({ totalPages: data.totalPages });
            this.setState({ currentPage: data.currentPage });
            this.setState({ responseMsg: data });
            console.log(data);
            this.setIsLoading(false);
            this.loadDataAsync(page, size);
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

  setTotalPages(_totalPages: Number) {
    this.setState({ totalPages: _totalPages });
  }

  setTotalItems(_totalItems: Number) {
    this.setState({ totalItems: _totalItems });
  }

  setCurrentPage(_currentPage: Number) {
    this.setState({ currentPage: _currentPage });
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
