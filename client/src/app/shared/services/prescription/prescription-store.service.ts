import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prescription } from '../../models/prescription';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { PrescriptionHttpService } from './prescription-http.service';
import { confirm } from 'devextreme/ui/dialog';
import { MedicalCheckupStore } from '../medical-checkup/medical-checkup-store.service';

interface PrescriptionState {
  prescriptionList: Array<Prescription>;
  exportData: Array<Prescription>;
  selectedPrescription: Object;
  prescriptionInstance: Prescription;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: PrescriptionState = {
  prescriptionList: [],
  selectedPrescription: {},
  prescriptionInstance: undefined,
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class PrescriptionStore extends StateService<PrescriptionState> {
  constructor(
    private prescriptionService: PrescriptionHttpService,
    private store: StoreService,
    private medicalCheckupService: MedicalCheckupStore
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
    sourceArray: Array<Prescription>,
    addedArray: Array<Prescription>
  ): Array<Prescription> {
    let result: Array<Prescription> = sourceArray;
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
    return this.prescriptionService
      .fetchPrescription(page, size)
      .toPromise()
      .then((data: any) => {
        if (page === 0) {
          this.setState({
            prescriptionList: new Array<Prescription>(size),
          });
        } else {
          this.setState({
            prescriptionList: new Array<Prescription>(page * size),
          });
        }
        console.log('Current flag: infite list');
        console.log(this.state.prescriptionList);
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
    this.prescriptionService.fetchPrescription(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          prescriptionList: this.state.prescriptionList.concat(data.items),
        });
        console.log('Infinite list');
        console.log(this.state.prescriptionList);
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

  loadDataAsyncByCustomerID(page: number, size: number, customerID: string) {
    this.setIsLoading(true);
    this.prescriptionService
      .fetchPrescriptionByCustomerID(page, size, customerID)
      .subscribe({
        next: (data: any) => {
          this.setState({
            prescriptionList: this.fillEmpty(
              page,
              size,
              this.state.prescriptionList,
              data.items
            ),
          });
          console.log('Pure list');
          console.log(this.state.prescriptionList);
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

  initInfiniteDataByCustomerID(
    page: number,
    size: number,
    customerID: string
  ) {
    return this.prescriptionService
      .fetchPrescriptionByCustomerID(page, size, customerID)
      .toPromise()
      .then((data: any) => {
        this.setState({
          prescriptionList: new Array<Prescription>(data.items.length),
        });
        console.log('Current flag: infite list');
        console.log(this.state.prescriptionList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.loadDataAsyncByCustomerID(page, size, customerID);
      });
  }

  loadInfiniteDataAsyncByCustomerID(
    page: number,
    size: number,
    customerID: string
  ) {
    this.setIsLoading(true);
    this.prescriptionService
      .fetchPrescriptionByCustomerID(page, size, customerID)
      .subscribe({
        next: (data: any) => {
          this.setState({
            prescriptionList: this.state.prescriptionList.concat(data.items),
          });
          console.log('Infinite list');
          console.log(this.state.prescriptionList);
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
    this.prescriptionService
      .fetchPrescription(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          prescriptionList: new Array<Prescription>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.prescriptionList);
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
    this.prescriptionService
      .filterPrescriptionByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          prescriptionList: new Array<Prescription>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.prescriptionList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterPrescriptionByCategory(value, page, size);
      });
  }

  initInfiniteFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.prescriptionService
      .filterPrescriptionByCategory(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          prescriptionList: new Array<Prescription>(size),
        });
        console.log('Current flag: infinite filtered list');
        console.log(this.state.prescriptionList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterPrescriptionByCategory(value, page, size);
      });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.prescriptionService
      .searchPrescriptionByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          prescriptionList: new Array<Prescription>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.prescriptionList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchPrescriptionByName(value, page, size);
      });
  }

  initInfiniteSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.prescriptionService
      .searchPrescriptionByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            prescriptionList: new Array<Prescription>(size),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.prescriptionList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchPrescriptionByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.prescriptionService
      .sortPrescriptionByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          prescriptionList: new Array<Prescription>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.prescriptionList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortPrescriptionByPrice(value, page, size);
      });
  }

  initInfiniteSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.prescriptionService
      .sortPrescriptionByPrice(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          prescriptionList: new Array<Prescription>(size),
        });
        console.log('Current flag: sort list');
        console.log(this.state.prescriptionList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortPrescriptionByPrice(value, page, size);
      });
  }

  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.prescriptionService.fetchPrescription(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          prescriptionList: this.fillEmpty(
            page,
            size,
            this.state.prescriptionList,
            data.items
          ),
        });
        console.log('Pure list');
        console.log(this.state.prescriptionList);
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
    this.prescriptionService.fetchPrescription(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          prescriptionList: this.fillEmpty(
            page,
            size,
            this.state.prescriptionList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.prescriptionList);
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

  $prescriptionList: Observable<Array<Prescription>> = this.select(
    (state) => state.prescriptionList
  );

  $exportData: Observable<Array<Prescription>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedPrescription: Observable<Object> = this.select(
    (state) => state.selectedPrescription
  );

  $prescriptionInstance: Observable<Prescription> = this.select(
    (state) => state.prescriptionInstance
  );

  uploadPrescription(prescription: Prescription, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.prescriptionService.uploadPrescription(prescription).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setTotalItems(this.state.totalItems + 1);
            console.log(data);
            this.loadDataAsync(page, size);
            this.medicalCheckupService
              .initCompleteInfiniteData(page, size)
              .then(() => {
                this.medicalCheckupService.setIsPrescriptionDone(true);
              });
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

  updatePrescription(
    prescription: Prescription,
    key: string,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.prescriptionService
          .updatePrescription(prescription, key)
          .subscribe({
            next: (data: any) => {
              this.setState({ responseMsg: data });
              console.log(data);
              this.loadDataAsync(page, size);
              this.medicalCheckupService.initCompleteInfiniteData(page, size);
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

  deleteSelectedPrescriptions(
    selectedPrescriptions: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.prescriptionService
          .deleteSelectedPrescriptions(selectedPrescriptions)
          .subscribe({
            next: (data: any) => {
              this.setState({ responseMsg: data });
              console.log(data);
              this.loadDataAsync(page, size);
              console.log(this.state.prescriptionList);
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

  deleteAllPrescriptions() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.prescriptionService.deleteAllPrescriptions().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ prescriptionList: [] });
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

  deletePrescription(id: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.prescriptionService.deletePrescription(id).subscribe({
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

  selectPrescription(_prescription: Prescription) {
    this.setState({ selectedPrescription: _prescription });
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

  filterPrescriptionByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.prescriptionService
      .filterPrescriptionByPrice(criteria, value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            prescriptionList: this.fillEmpty(
              page,
              size,
              this.state.prescriptionList,
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

  filterPrescriptionByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.prescriptionService
      .filterPrescriptionByCategory(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            prescriptionList: this.fillEmpty(
              page,
              size,
              this.state.prescriptionList,
              data.items
            ),
          });
          console.log('Filtered list');
          console.log(this.state.prescriptionList);
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

  filterInfinitePrescriptionByCategory(
    value: string,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.prescriptionService
      .filterPrescriptionByCategory(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            prescriptionList: this.state.prescriptionList.concat(data.items),
          });
          console.log('Filtered list');
          console.log(this.state.prescriptionList);
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

  searchPrescriptionByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.prescriptionService
      .searchPrescriptionByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              prescriptionList: this.fillEmpty(
                page,
                size,
                this.state.prescriptionList,
                data.items
              ),
            });
          } else {
            this.store.showNotif('No result found!', 'custom');
          }
          console.log('Searched list');
          console.log(this.state.prescriptionList);
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

  searchInfinitePrescriptionByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.prescriptionService
      .searchPrescriptionByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              prescriptionList: this.state.prescriptionList.concat(data.items),
            });
          } else {
            this.store.showNotif('No result found!', 'custome');
          }
          console.log('Infite searched list');
          console.log(this.state.prescriptionList);
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

  sortPrescriptionByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.prescriptionService
      .sortPrescriptionByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            prescriptionList: this.fillEmpty(
              page,
              size,
              this.state.prescriptionList,
              data.items
            ),
          });
          this.setState({ totalItems: data.totalItems });
          this.setState({ totalPages: data.totalPages });
          this.setState({ currentPage: data.currentPage });
          console.log('Sorted list');
          console.log(this.state.prescriptionList);
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

  sortPrescriptionByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.prescriptionService
      .sortPrescriptionByPrice(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            prescriptionList: this.fillEmpty(
              page,
              size,
              this.state.prescriptionList,
              data.items
            ),
          });
          this.setState({ totalItems: data.totalItems });
          this.setState({ totalPages: data.totalPages });
          this.setState({ currentPage: data.currentPage });
          console.log('Sorted list');
          console.log(this.state.prescriptionList);
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

  sortInfinitePrescriptionByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.prescriptionService
      .sortPrescriptionByPrice(value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            prescriptionList: this.state.prescriptionList.concat(data.items),
          });
          console.log('Infite sorted list');
          console.log(this.state.prescriptionList);
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

  getPrescription(id: string) {
    this.setIsLoading(true);
    return this.prescriptionService
      .getPrescription(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ prescriptionInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  getPrescriptionByMedicalCheckupID(id: string) {
    this.setIsLoading(true);
    return this.prescriptionService
      .getPrescriptionByMedicalCheckupID(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ prescriptionInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  setExportData(array: Array<Prescription>) {
    this.setState({ prescriptionList: array });
  }
}
