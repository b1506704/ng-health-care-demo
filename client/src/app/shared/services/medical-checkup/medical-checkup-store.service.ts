import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalCheckup } from '../../models/medical-checkup';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { MedicalCheckupHttpService } from './medical-checkup-http.service';
import { confirm } from 'devextreme/ui/dialog';

interface MedicalCheckupState {
  medicalCheckupList: Array<MedicalCheckup>;
  exportData: Array<MedicalCheckup>;
  selectedMedicalCheckup: Object;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: MedicalCheckupState = {
  medicalCheckupList: [],
  selectedMedicalCheckup: {},
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class MedicalCheckupStore extends StateService<MedicalCheckupState> {
  constructor(
    private medicalCheckupService: MedicalCheckupHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.initInfiniteData(0, 5);
  }

  fillEmpty(
    startIndex: number,
    endIndex: number,
    sourceArray: Array<MedicalCheckup>,
    addedArray: Array<MedicalCheckup>
  ) {
    let result: Array<MedicalCheckup> = sourceArray;
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
    this.medicalCheckupService
      .fetchMedicalCheckup(page, size)
      .toPromise()
      .then((data: any) => {
        if (page === 0) {
          this.setState({
            medicalCheckupList: new Array<MedicalCheckup>(size),
          });
        } else {
          this.setState({
            medicalCheckupList: new Array<MedicalCheckup>(page * size),
          });
        }
        console.log('Current flag: infite list');
        console.log(this.state.medicalCheckupList);
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
    this.medicalCheckupService.fetchMedicalCheckup(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          medicalCheckupList: this.state.medicalCheckupList.concat(data.items),
        });
        console.log('Infinite list');
        console.log(this.state.medicalCheckupList);
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
    this.medicalCheckupService
      .fetchMedicalCheckup(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicalCheckupList: new Array<MedicalCheckup>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.medicalCheckupList);
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
    this.medicalCheckupService
      .filterMedicalCheckupByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicalCheckupList: new Array<MedicalCheckup>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.medicalCheckupList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterMedicalCheckupByCategory(value, page, size);
      });
  }

  initInfiniteFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.medicalCheckupService
      .filterMedicalCheckupByCategory(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicalCheckupList: new Array<MedicalCheckup>(size),
        });
        console.log('Current flag: infinite filtered list');
        console.log(this.state.medicalCheckupList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterMedicalCheckupByCategory(value, page, size);
      });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.medicalCheckupService
      .searchMedicalCheckupByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicalCheckupList: new Array<MedicalCheckup>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.medicalCheckupList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchMedicalCheckupByName(value, page, size);
      });
  }

  initInfiniteSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.medicalCheckupService
      .searchMedicalCheckupByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            medicalCheckupList: new Array<MedicalCheckup>(size),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.medicalCheckupList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchMedicalCheckupByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.medicalCheckupService
      .sortMedicalCheckupByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicalCheckupList: new Array<MedicalCheckup>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.medicalCheckupList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortMedicalCheckupByPrice(value, page, size);
      });
  }

  initInfiniteSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.medicalCheckupService
      .sortMedicalCheckupByPrice(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          medicalCheckupList: new Array<MedicalCheckup>(size),
        });
        console.log('Current flag: sort list');
        console.log(this.state.medicalCheckupList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortMedicalCheckupByPrice(value, page, size);
      });
  }

  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService.fetchMedicalCheckup(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          medicalCheckupList: this.fillEmpty(
            page,
            size,
            this.state.medicalCheckupList,
            data.items
          ),
        });
        console.log('Pure list');
        console.log(this.state.medicalCheckupList);
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
    this.medicalCheckupService.fetchMedicalCheckup(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          medicalCheckupList: this.fillEmpty(
            page,
            size,
            this.state.medicalCheckupList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.medicalCheckupList);
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

  $medicalCheckupList: Observable<Array<MedicalCheckup>> = this.select(
    (state) => state.medicalCheckupList
  );

  $exportData: Observable<Array<MedicalCheckup>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedMedicalCheckup: Observable<Object> = this.select(
    (state) => state.selectedMedicalCheckup
  );

  uploadMedicalCheckup(
    medicalCheckup: MedicalCheckup,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicalCheckupService
          .uploadMedicalCheckup(medicalCheckup)
          .subscribe({
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

  updateMedicalCheckup(
    medicalCheckup: MedicalCheckup,
    key: string,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicalCheckupService
          .updateMedicalCheckup(medicalCheckup, key)
          .subscribe({
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

  deleteSelectedMedicalCheckups(
    selectedMedicalCheckups: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicalCheckupService
          .deleteSelectedMedicalCheckups(selectedMedicalCheckups)
          .subscribe({
            next: (data: any) => {
              this.setState({ responseMsg: data });
              console.log(data);
              this.loadDataAsync(page, size);
              console.log(this.state.medicalCheckupList);
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

  deleteAllMedicalCheckups() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicalCheckupService.deleteAllMedicalCheckups().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ medicalCheckupList: [] });
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

  deleteMedicalCheckup(id: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicalCheckupService.deleteMedicalCheckup(id).subscribe({
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

  selectMedicalCheckup(_medicalCheckup: MedicalCheckup) {
    this.setState({ selectedMedicalCheckup: _medicalCheckup });
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

  filterMedicalCheckupByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .filterMedicalCheckupByPrice(criteria, value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            medicalCheckupList: this.fillEmpty(
              page,
              size,
              this.state.medicalCheckupList,
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

  filterMedicalCheckupByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .filterMedicalCheckupByCategory(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            medicalCheckupList: this.fillEmpty(
              page,
              size,
              this.state.medicalCheckupList,
              data.items
            ),
          });
          console.log('Filtered list');
          console.log(this.state.medicalCheckupList);
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

  filterInfiniteMedicalCheckupByCategory(
    value: string,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .filterMedicalCheckupByCategory(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            medicalCheckupList: this.state.medicalCheckupList.concat(
              data.items
            ),
          });
          console.log('Filtered list');
          console.log(this.state.medicalCheckupList);
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

  searchMedicalCheckupByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchMedicalCheckupByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              medicalCheckupList: this.fillEmpty(
                page,
                size,
                this.state.medicalCheckupList,
                data.items
              ),
            });
          } else {
            this.store.showNotif('No result found!', 'custom');
          }
          console.log('Searched list');
          console.log(this.state.medicalCheckupList);
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

  searchInfiniteMedicalCheckupByName(
    value: string,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchMedicalCheckupByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              medicalCheckupList: this.state.medicalCheckupList.concat(
                data.items
              ),
            });
          } else {
            this.store.showNotif('No result found!', 'custome');
          }
          console.log('Infite searched list');
          console.log(this.state.medicalCheckupList);
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

  sortMedicalCheckupByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .sortMedicalCheckupByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            medicalCheckupList: this.fillEmpty(
              page,
              size,
              this.state.medicalCheckupList,
              data.items
            ),
          });
          this.setState({ totalItems: data.totalItems });
          this.setState({ totalPages: data.totalPages });
          this.setState({ currentPage: data.currentPage });
          console.log('Sorted list');
          console.log(this.state.medicalCheckupList);
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

  sortMedicalCheckupByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .sortMedicalCheckupByPrice(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            medicalCheckupList: this.fillEmpty(
              page,
              size,
              this.state.medicalCheckupList,
              data.items
            ),
          });
          this.setState({ totalItems: data.totalItems });
          this.setState({ totalPages: data.totalPages });
          this.setState({ currentPage: data.currentPage });
          console.log('Sorted list');
          console.log(this.state.medicalCheckupList);
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

  sortInfiniteMedicalCheckupByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .sortMedicalCheckupByPrice(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            medicalCheckupList: this.state.medicalCheckupList.concat(
              data.items
            ),
          });
          console.log('Infite sorted list');
          console.log(this.state.medicalCheckupList);
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

  setExportData(array: Array<MedicalCheckup>) {
    this.setState({ medicalCheckupList: array });
  }
}
