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
  cacheImageList: Array<string>;
  searchedMedicineList: Array<Medicine>;
  selectedMedicine: Object;
  isFilteringByPrice: boolean;
  isFilteringByCategory: boolean;
  isSearchingByName: boolean;
  isSortingByPrice: boolean;
  isSortingByName: boolean;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: MedicineState = {
  medicineList: [],
  filteredMedicineList: [],
  cacheImageList: [],
  searchedMedicineList: [],
  selectedMedicine: {},
  isFilteringByPrice: false,
  isFilteringByCategory: false,
  isSearchingByName: false,
  isSortingByPrice: false,
  isSortingByName: false,
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
    this.initData(0, 5);
  }

  fillEmpty(
    startIndex: number,
    endIndex: number,
    sourceArray: Array<Medicine>,
    addedArray: Array<Medicine>
  ) {
    let result: Array<Medicine> = sourceArray;
    let fillIndex = startIndex * endIndex;
    for (var j = 0; j < addedArray.length; j++) {
      result[fillIndex] = addedArray[j];
      fillIndex++;
    }
    // 0 => 0 ,1,2,3,4,
    // 1 -> 5,6,7,8,9
    // 2 -> 10,11,12,13,14
    // 17 -> 85,86,87,88,89
    console.log(result);
    return result;
  }

  initData(page: number, size: number) {
    this.medicineService
      .fetchMedicine(0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicineList: new Array<Medicine>(data.totalItems),
        });
        console.log(this.state.medicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        setTimeout(() => {
          this.loadDataAsync(page, size);
        }, 150);
      });
  }

  initFilterByCategoryData(value: string, page: number, size: number) {
    this.medicineService
      .filterMedicineByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          filteredMedicineList: new Array<Medicine>(data.totalItems),
        });
        console.log(this.state.filteredMedicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        setTimeout(() => {
          this.filterMedicineByCategory(value, page, size);
        }, 150);
      });
  }

  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.medicineService.fetchMedicine(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          medicineList: this.fillEmpty(
            page,
            size,
            this.state.medicineList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
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
        this.setState({
          medicineList: this.fillEmpty(
            page,
            size,
            this.state.medicineList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
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

  $isSearchingByName: Observable<boolean> = this.select(
    (state) => state.isSearchingByName
  );

  $isFilteringByPrice: Observable<boolean> = this.select(
    (state) => state.isFilteringByPrice
  );

  $isFilteringByCategory: Observable<boolean> = this.select(
    (state) => state.isFilteringByCategory
  );

  $isSortingByPrice: Observable<boolean> = this.select(
    (state) => state.isSortingByPrice
  );

  $isSortingByName: Observable<boolean> = this.select(
    (state) => state.isSortingByName
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
            this.setState({ responseMsg: data });
            this.setTotalItems(this.state.totalItems + 1);
            console.log(data);
            this.loadDataAsync(page, size);
            this.setIsLoading(false);
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
            this.setState({ responseMsg: data });
            console.log(data);
            this.loadDataAsync(page, size);
            this.setIsLoading(false);
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
              this.setState({ responseMsg: data });
              console.log(data);
              this.loadDataAsync(page, size);
              console.log(this.state.medicineList);
              this.setIsLoading(false);
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

  deleteAllMedicines() {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicineService.deleteAllMedicines().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ medicineList: [] });
            this.setState({ totalPages: 0 });
            this.setState({ currentPage: 0 });
            this.setState({ totalItems: 0 });
            console.log(data);
            this.setIsLoading(false);
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
            this.setState({ responseMsg: data });
            this.setTotalItems(this.state.totalItems - 1);
            console.log(data);
            this.loadDataAsync(page, size);
            this.setIsLoading(false);
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

  setTotalPages(_totalPages: number) {
    this.setState({ totalPages: _totalPages });
  }

  setTotalItems(_totalItems: number) {
    this.setState({ totalItems: _totalItems });
  }

  setCurrentPage(_currentPage: number) {
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

  filterMedicineByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.setIsFilteringByPrice(true);
        this.medicineService
          .filterMedicineByPrice(criteria, value, page, size)
          .subscribe({
            next: (data: any) => {
              this.setState({ responseMsg: data });
              this.setState({
                filteredMedicineList: this.fillEmpty(
                  page,
                  size,
                  this.state.filteredMedicineList,
                  data.items
                ),
              });
              this.setState({ totalItems: data.totalItems });
              this.setState({ totalPages: data.totalPages });
              this.setState({ currentPage: data.currentPage });
              this.setIsLoading(false);
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

  filterMedicineByCategory(value: string, page: number, size: number) {
    // this.confirmDialog().then((confirm: boolean) => {
    //   if (confirm) {
        this.setIsLoading(true);
        this.setIsFilteringByCategory(true);
        this.medicineService
          .filterMedicineByCategory(value, page, size)
          .subscribe({
            next: (data: any) => {
              this.setState({
                filteredMedicineList: this.fillEmpty(
                  page,
                  size,
                  this.state.filteredMedicineList,
                  data.items
                ),
              });
              this.setState({ totalItems: data.totalItems });
              this.setState({ totalPages: data.totalPages });
              this.setState({ currentPage: data.currentPage });
              this.setIsLoading(false);
              this.store.showNotif('Filtered Mode On', 'custom');
            },
            error: (data: any) => {
              this.setIsLoading(false);
              this.store.showNotif(data.error.errorMessage, 'error');
              console.log(data);
            },
          });
    //   }
    // });
  }

  searchMedicineByName(value: string, page: number, size: number) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.setIsSearchingByName(true);
        this.medicineService.searchMedicineByName(value, page, size).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({
              medicineList: this.fillEmpty(
                page,
                size,
                this.state.medicineList,
                data.items
              ),
            });
            this.setState({ totalItems: data.totalItems });
            this.setState({ totalPages: data.totalPages });
            this.setState({ currentPage: data.currentPage });
            this.setIsLoading(false);
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

  sortMedicineByName(value: string, page: number, size: number) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsSortingByName(true);
        this.setIsLoading(true);
        this.medicineService.sortMedicineByName(value, page, size).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({
              medicineList: this.fillEmpty(
                page,
                size,
                this.state.medicineList,
                data.items
              ),
            });
            this.setState({ totalItems: data.totalItems });
            this.setState({ totalPages: data.totalPages });
            this.setState({ currentPage: data.currentPage });
            this.setIsLoading(false);
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

  sortMedicineByPrice(value: number, page: number, size: number) {
    this.confirmDialog().then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.setIsSortingByPrice(true);
        this.medicineService.sortMedicineByPrice(value, page, size).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({
              medicineList: this.fillEmpty(
                page,
                size,
                this.state.medicineList,
                data.items
              ),
            });
            this.setState({ totalItems: data.totalItems });
            this.setState({ totalPages: data.totalPages });
            this.setState({ currentPage: data.currentPage });
            this.setIsLoading(false);
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

  setIsFilteringByCategory(_isFiltering: boolean) {
    this.setState({ isFilteringByCategory: _isFiltering });
  }

  setIsFilteringByPrice(_isFiltering: boolean) {
    this.setState({ isFilteringByPrice: _isFiltering });
  }

  setIsSearchingByName(_isSearching: boolean) {
    this.setState({ isSearchingByName: _isSearching });
  }

  setIsSortingByName(_isSearching: boolean) {
    this.setState({ isSortingByName: _isSearching });
  }

  setIsSortingByPrice(_isSorting: boolean) {
    this.setState({ isSortingByPrice: _isSorting });
  }
}
