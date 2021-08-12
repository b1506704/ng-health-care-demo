import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medicine } from '../../models/medicine';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { MedicineHttpService } from './medicine-http.service';
import { confirm } from 'devextreme/ui/dialog';

interface MedicineState {
  medicineList: Array<Medicine>;
  exportData: Array<Medicine>;
  medicineInstance: Medicine;
  selectedMedicine: Object;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: MedicineState = {
  medicineList: [],
  selectedMedicine: {},
  exportData: [],
  medicineInstance: undefined,
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
  }
  /**
   * This is a function which fills the items received from pagination in a specific store's state variable.
   * 
   * @author Le Bao Anh
   * @version 1.0.0
   * @param {number} startIndex - The current page of ss pagination
   * @param {number} endIndex - The page size of ss pagination
   * @param {Array<Object>} sourceArray - The source array/state in a specific store service
   * @param {Array<Object>} addedArray - The array of items received from ss pagination
   * @return {Array<Object>} Return an array with filled items from ss pagination
   * @example
   * this.setState({
            pendingCheckupList: this.fillEmpty(
              page,
              size,
              this.state.pendingCheckupList,
              data.items
            ),
          });
   */
  fillEmpty(
    startIndex: number,
    endIndex: number,
    sourceArray: Array<Medicine>,
    addedArray: Array<Medicine>
  ): Array<Medicine> {
    let result: Array<Medicine> = sourceArray;
    let fillIndex = startIndex * endIndex;
    for (var j = 0; j < addedArray.length; j++) {
      result[fillIndex] = addedArray[j];
      fillIndex++;
    }
    // endIndex = pageSize
    // pageSize = 5
    // 0 => 0 ,1,2,3,4,
    // 1 -> 5,6,7,8,9
    // 2 -> 10,11,12,13,14
    // 17 -> 85,86,87,88,89
    console.log('Filled array result');
    console.log(result);
    return result;
  }

  initInfiniteData(page: number, size: number) {
    return this.medicineService
      .fetchMedicine(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicineList: new Array<Medicine>(data.items.length),
        });
        console.log('Current flag: infite list');
        console.log(this.state.medicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.loadDataAsync(page, size);
      });
  }

  loadInfiniteDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.medicineService.fetchMedicine(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          medicineList: this.state.medicineList.concat(data.items),
        });
        console.log('Infinite list');
        console.log(this.state.medicineList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  initData(page: number, size: number) {
    this.medicineService
      .fetchMedicine(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicineList: new Array<Medicine>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.medicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.loadDataAsync(page, size);
      });
  }

  initFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.medicineService
      .filterMedicineByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicineList: new Array<Medicine>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.medicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterMedicineByCategory(value, page, size);
      });
  }

  initInfiniteFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.medicineService
      .filterMedicineByCategory(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicineList: new Array<Medicine>(data.items.length),
        });
        console.log('Current flag: infinite filtered list');
        console.log(this.state.medicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterMedicineByCategory(value, page, size);
      });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.medicineService
      .searchMedicineByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicineList: new Array<Medicine>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.medicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchMedicineByName(value, page, size);
      });
  }

  initInfiniteSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.medicineService
      .searchMedicineByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            medicineList: new Array<Medicine>(data.items.length),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.medicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchMedicineByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.medicineService
      .sortMedicineByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicineList: new Array<Medicine>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.medicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortMedicineByPrice(value, page, size);
      });
  }

  initInfiniteSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.medicineService
      .sortMedicineByPrice(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicineList: new Array<Medicine>(data.items.length),
        });
        console.log('Current flag: sort list');
        console.log(this.state.medicineList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortMedicineByPrice(value, page, size);
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
        console.log('Pure list');
        console.log(this.state.medicineList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
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
        console.log('Pure list');
        console.log(this.state.medicineList);
        console.log('Server response');
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

  $medicineInstance: Observable<Medicine> = this.select(
    (state) => state.medicineInstance
  );

  $exportData: Observable<Array<Medicine>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedMedicine: Observable<Object> = this.select(
    (state) => state.selectedMedicine
  );

  uploadMedicine(medicine: Medicine, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
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
    this.confirmDialog('').then((confirm: boolean) => {
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

  confirmDialog(msg: string) {
    if (msg != '') {
      return confirm(`<b>${msg}</b>`, 'Confirm changes');
    }
    return confirm(`<b>Are you sure?</b>`, 'Confirm changes');
  }

  deleteSelectedMedicines(
    selectedMedicines: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
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
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
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
    this.confirmDialog('').then((confirm: boolean) => {
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

  getMedicine(id: string) {
    this.setIsLoading(true);
    return this.medicineService
      .getMedicine(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ medicineInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  filterMedicineByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.medicineService
      .filterMedicineByPrice(criteria, value, page, size)
      .subscribe({
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
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  filterMedicineByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicineService.filterMedicineByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          medicineList: this.fillEmpty(
            page,
            size,
            this.state.medicineList,
            data.items
          ),
        });
        console.log('Filtered list');
        console.log(this.state.medicineList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  filterInfiniteMedicineByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicineService.filterMedicineByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          medicineList: this.state.medicineList.concat(data.items),
        });
        console.log('Filtered list');
        console.log(this.state.medicineList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  searchMedicineByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicineService.searchMedicineByName(value, page, size).subscribe({
      next: (data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            medicineList: this.fillEmpty(
              page,
              size,
              this.state.medicineList,
              data.items
            ),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Searched list');
        console.log(this.state.medicineList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  searchInfiniteMedicineByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicineService.searchMedicineByName(value, page, size).subscribe({
      next: (data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            medicineList: this.state.medicineList.concat(data.items),
          });
        } else {
          this.store.showNotif('No result found!', 'custome');
        }
        console.log('Infite searched list');
        console.log(this.state.medicineList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  sortMedicineByName(value: string, page: number, size: number) {
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
        console.log('Sorted list');
        console.log(this.state.medicineList);
        console.log('Server response');
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

  sortMedicineByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
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
        console.log('Sorted list');
        console.log(this.state.medicineList);
        console.log('Server response');
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

  sortInfiniteMedicineByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicineService.sortMedicineByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          medicineList: this.state.medicineList.concat(data.items),
        });
        console.log('Infite sorted list');
        console.log(this.state.medicineList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  setExportData(array: Array<Medicine>) {
    this.setState({ medicineList: array });
  }
}
