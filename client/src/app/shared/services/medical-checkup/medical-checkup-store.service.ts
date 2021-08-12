import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalCheckup } from '../../models/medical-checkup';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { MedicalCheckupHttpService } from './medical-checkup-http.service';
import { confirm } from 'devextreme/ui/dialog';

interface MedicalCheckupState {
  medicalCheckupList: Array<MedicalCheckup>;
  pendingCheckupList: Array<MedicalCheckup>;
  completeCheckupList: Array<MedicalCheckup>;
  isPrescriptionDone: boolean;
  exportData: Array<MedicalCheckup>;
  selectedMedicalCheckup: Object;
  totalCheckupPendingPages: number;
  totalCheckupCompletePages: number;
  currentCheckupPendingPage: number;
  currentCheckupCompletePage: number;
  totalCheckupPendingItems: number;
  totalCheckupCompleteItems: number;
  responseMsg: String;
}
const initialState: MedicalCheckupState = {
  medicalCheckupList: [],
  pendingCheckupList: [],
  completeCheckupList: [],
  selectedMedicalCheckup: {},
  exportData: [],
  totalCheckupPendingPages: 0,
  totalCheckupCompletePages: 0,
  currentCheckupPendingPage: 0,
  currentCheckupCompletePage: 0,
  totalCheckupPendingItems: 0,
  totalCheckupCompleteItems: 0,
  isPrescriptionDone: false,
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
    sourceArray: Array<MedicalCheckup>,
    addedArray: Array<MedicalCheckup>
  ): Array<MedicalCheckup> {
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

  initPendingInfiniteData(page: number, size: number) {
    return this.medicalCheckupService
      .fetchPendingMedicalCheckup(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          pendingCheckupList: new Array<MedicalCheckup>(data.items.length),
        });

        console.log('Current flag: infite list');
        console.log(this.state.pendingCheckupList);
        this.setState({ totalCheckupPendingItems: data.totalItems });
        this.setState({ totalCheckupPendingPages: data.totalPages });
        this.setState({ currentCheckupPendingPage: data.currentPage });
      })
      .then(() => {
        this.loadPendingDataAsync(page, size);
      });
  }

  loadPendingInfiniteDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .fetchPendingMedicalCheckup(page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            pendingCheckupList: this.state.pendingCheckupList.concat(
              data.items
            ),
          });
          console.log('Infinite list');
          console.log(this.state.pendingCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupPendingItems: data.totalItems });
          this.setState({ totalCheckupPendingPages: data.totalPages });
          this.setState({ currentCheckupPendingPage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  initPendingInfiniteSearchByNameData(
    value: string,
    page: number,
    size: number
  ) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.medicalCheckupService
      .searchPendingMedicalCheckupByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            pendingCheckupList: new Array<MedicalCheckup>(data.items.length),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.pendingCheckupList);
        this.setState({ totalCheckupPendingItems: data.totalItems });
        this.setState({ totalCheckupPendingPages: data.totalPages });
        this.setState({ currentCheckupPendingPage: data.currentPage });
      })
      .then(() => {
        this.searchPendingMedicalCheckupByName(value, page, size);
      });
  }

  loadPendingDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .fetchPendingMedicalCheckup(page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            pendingCheckupList: this.fillEmpty(
              page,
              size,
              this.state.pendingCheckupList,
              data.items
            ),
          });
          console.log('Pure list');
          console.log(this.state.pendingCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupPendingItems: data.totalItems });
          this.setState({ totalCheckupPendingPages: data.totalPages });
          this.setState({ currentCheckupPendingPage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }
  //
  initPendingInfiniteDataByCustomerID(
    page: number,
    size: number,
    customerID: string
  ) {
    return this.medicalCheckupService
      .fetchPendingMedicalCheckupByCustomerID(page, size, customerID)
      .toPromise()
      .then((data: any) => {
        this.setState({
          pendingCheckupList: new Array<MedicalCheckup>(data.items.length),
        });

        console.log('Current flag: infite list');
        console.log(this.state.pendingCheckupList);
        this.setState({ totalCheckupPendingItems: data.totalItems });
        this.setState({ totalCheckupPendingPages: data.totalPages });
        this.setState({ currentCheckupPendingPage: data.currentPage });
      })
      .then(() => {
        this.loadPendingDataAsyncByCustomerID(page, size, customerID);
      });
  }

  loadPendingInfiniteDataAsyncByCustomerID(
    page: number,
    size: number,
    customerID: string
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .fetchPendingMedicalCheckupByCustomerID(page, size, customerID)
      .subscribe({
        next: (data: any) => {
          this.setState({
            pendingCheckupList: this.state.pendingCheckupList.concat(
              data.items
            ),
          });
          console.log('Infinite list');
          console.log(this.state.pendingCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupPendingItems: data.totalItems });
          this.setState({ totalCheckupPendingPages: data.totalPages });
          this.setState({ currentCheckupPendingPage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  initPendingInfiniteSearchByNameDataByCustomerID(
    value: string,
    page: number,
    size: number,
    customerID: string
  ) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.medicalCheckupService
      .searchPendingMedicalCheckupByNameByCustomerID(
        value,
        page,
        size,
        customerID
      )
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            pendingCheckupList: new Array<MedicalCheckup>(data.items.length),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.pendingCheckupList);
        this.setState({ totalCheckupPendingItems: data.totalItems });
        this.setState({ totalCheckupPendingPages: data.totalPages });
        this.setState({ currentCheckupPendingPage: data.currentPage });
      })
      .then(() => {
        this.searchPendingMedicalCheckupByNameAndCustomerID(
          value,
          page,
          size,
          customerID
        );
      });
  }

  loadPendingDataAsyncByCustomerID(
    page: number,
    size: number,
    customerID: string
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .fetchPendingMedicalCheckupByCustomerID(page, size, customerID)
      .subscribe({
        next: (data: any) => {
          this.setState({
            pendingCheckupList: this.fillEmpty(
              page,
              size,
              this.state.pendingCheckupList,
              data.items
            ),
          });
          console.log('Pure list');
          console.log(this.state.pendingCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupPendingItems: data.totalItems });
          this.setState({ totalCheckupPendingPages: data.totalPages });
          this.setState({ currentCheckupPendingPage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }
  //
  initCompleteInfiniteData(page: number, size: number) {
    return this.medicalCheckupService
      .fetchCompleteMedicalCheckup(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          completeCheckupList: new Array<MedicalCheckup>(data.items.length),
        });

        console.log('Current flag: infite list');
        console.log(this.state.completeCheckupList);
        this.setState({ totalCheckupCompleteItems: data.totalItems });
        this.setState({ totalCheckupCompletePages: data.totalPages });
        this.setState({ currentCheckupCompletePage: data.currentPage });
      })
      .then(() => {
        this.loadCompleteDataAsync(page, size);
      });
  }

  loadCompleteInfiniteDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .fetchCompleteMedicalCheckup(page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            completeCheckupList: this.state.completeCheckupList.concat(
              data.items
            ),
          });
          console.log('Infinite list');
          console.log(this.state.completeCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupCompleteItems: data.totalItems });
          this.setState({ totalCheckupCompletePages: data.totalPages });
          this.setState({ currentCheckupCompletePage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  initCompleteInfiniteSearchByNameData(
    value: string,
    page: number,
    size: number
  ) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.medicalCheckupService
      .searchCompleteMedicalCheckupByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            completeCheckupList: new Array<MedicalCheckup>(data.items.length),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.completeCheckupList);
        this.setState({ totalCheckupCompleteItems: data.totalItems });
        this.setState({ totalCheckupCompletePages: data.totalPages });
        this.setState({ currentCheckupCompletePage: data.currentPage });
      })
      .then(() => {
        this.searchCompleteMedicalCheckupByName(value, page, size);
      });
  }

  loadCompleteDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .fetchCompleteMedicalCheckup(page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({
            completeCheckupList: this.fillEmpty(
              page,
              size,
              this.state.completeCheckupList,
              data.items
            ),
          });
          console.log('Pure list');
          console.log(this.state.completeCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupCompleteItems: data.totalItems });
          this.setState({ totalCheckupCompletePages: data.totalPages });
          this.setState({ currentCheckupCompletePage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  initCompleteInfiniteDataByCustomerID(
    page: number,
    size: number,
    customerID: string
  ) {
    return this.medicalCheckupService
      .fetchCompleteMedicalCheckupByCustomerID(page, size, customerID)
      .toPromise()
      .then((data: any) => {
        this.setState({
          completeCheckupList: new Array<MedicalCheckup>(data.items.length),
        });

        console.log('Current flag: infite list');
        console.log(this.state.completeCheckupList);
        this.setState({ totalCheckupCompleteItems: data.totalItems });
        this.setState({ totalCheckupCompletePages: data.totalPages });
        this.setState({ currentCheckupCompletePage: data.currentPage });
      })
      .then(() => {
        this.loadCompleteDataAsyncByCustomerID(page, size, customerID);
      });
  }

  loadCompleteInfiniteDataAsyncByCustomerID(
    page: number,
    size: number,
    customerID: string
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .fetchCompleteMedicalCheckupByCustomerID(page, size, customerID)
      .subscribe({
        next: (data: any) => {
          this.setState({
            completeCheckupList: this.state.completeCheckupList.concat(
              data.items
            ),
          });
          console.log('Infinite list');
          console.log(this.state.completeCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupCompleteItems: data.totalItems });
          this.setState({ totalCheckupCompletePages: data.totalPages });
          this.setState({ currentCheckupCompletePage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  initCompleteInfiniteSearchByNameDataByCustomerID(
    value: string,
    page: number,
    size: number,
    customerID: string
  ) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.medicalCheckupService
      .searchCompleteMedicalCheckupByNameByCustomerID(
        value,
        page,
        size,
        customerID
      )
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            completeCheckupList: new Array<MedicalCheckup>(data.items.length),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.completeCheckupList);
        this.setState({ totalCheckupCompleteItems: data.totalItems });
        this.setState({ totalCheckupCompletePages: data.totalPages });
        this.setState({ currentCheckupCompletePage: data.currentPage });
      })
      .then(() => {
        this.searchCompleteMedicalCheckupByNameAndCustomerID(
          value,
          page,
          size,
          customerID
        );
      });
  }

  loadCompleteDataAsyncByCustomerID(
    page: number,
    size: number,
    customerID: string
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .fetchCompleteMedicalCheckupByCustomerID(page, size, customerID)
      .subscribe({
        next: (data: any) => {
          this.setState({
            completeCheckupList: this.fillEmpty(
              page,
              size,
              this.state.completeCheckupList,
              data.items
            ),
          });
          console.log('Pure list');
          console.log(this.state.completeCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupCompleteItems: data.totalItems });
          this.setState({ totalCheckupCompletePages: data.totalPages });
          this.setState({ currentCheckupCompletePage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }
  //
  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $medicalCheckupList: Observable<Array<MedicalCheckup>> = this.select(
    (state) => state.medicalCheckupList
  );

  $pendingCheckupList: Observable<Array<MedicalCheckup>> = this.select(
    (state) => state.pendingCheckupList
  );

  $completeCheckupList: Observable<Array<MedicalCheckup>> = this.select(
    (state) => state.completeCheckupList
  );

  $exportData: Observable<Array<MedicalCheckup>> = this.select(
    (state) => state.exportData
  );

  $totalCheckupPendingPages: Observable<Number> = this.select(
    (state) => state.totalCheckupPendingPages
  );

  $totalCheckupCompletePages: Observable<Number> = this.select(
    (state) => state.totalCheckupCompletePages
  );

  $totalCheckupPendingItems: Observable<Number> = this.select(
    (state) => state.totalCheckupPendingItems
  );

  $totalCheckupCompleteItems: Observable<Number> = this.select(
    (state) => state.totalCheckupCompleteItems
  );

  $currentCheckupPendingPage: Observable<Number> = this.select(
    (state) => state.currentCheckupPendingPage
  );

  $currentCheckupCompletePage: Observable<Number> = this.select(
    (state) => state.currentCheckupCompletePage
  );

  $selectedMedicalCheckup: Observable<Object> = this.select(
    (state) => state.selectedMedicalCheckup
  );

  $isPrescriptionDone: Observable<boolean> = this.select(
    (state) => state.isPrescriptionDone
  );

  uploadMedicalCheckup(
    medicalCheckup: MedicalCheckup,
    page: number,
    size: number,
    customerID: string
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.medicalCheckupService
          .uploadMedicalCheckup(medicalCheckup)
          .subscribe({
            next: (data: any) => {
              this.setState({ responseMsg: data });
              this.setTotalPendingItems(
                this.state.totalCheckupPendingItems + 1
              );
              console.log(data);
              this.initPendingInfiniteDataByCustomerID(page, size, customerID);
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
              this.loadCompleteDataAsync(page, size);
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

  selectMedicalCheckup(_medicalCheckup: MedicalCheckup) {
    this.setState({ selectedMedicalCheckup: _medicalCheckup });
  }

  setTotalPendingPages(_totalPages: number) {
    this.setState({ totalCheckupPendingPages: _totalPages });
  }

  setTotalPendingItems(_totalItems: number) {
    this.setState({ totalCheckupPendingItems: _totalItems });
  }

  setCurrentPendingPage(_currentPage: number) {
    this.setState({ currentCheckupPendingPage: _currentPage });
  }

  setTotalCompletePages(_totalPages: number) {
    this.setState({ totalCheckupCompletePages: _totalPages });
  }

  setTotalCompleteItems(_totalItems: number) {
    this.setState({ totalCheckupCompleteItems: _totalItems });
  }

  setCurrentCompletePage(_currentPage: number) {
    this.setState({ currentCheckupCompletePage: _currentPage });
  }

  searchPendingMedicalCheckupByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchPendingMedicalCheckupByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              pendingCheckupList: this.fillEmpty(
                page,
                size,
                this.state.pendingCheckupList,
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
          this.setState({ totalCheckupPendingItems: data.totalItems });
          this.setState({ totalCheckupPendingPages: data.totalPages });
          this.setState({ currentCheckupPendingPage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  searchPendingInfiniteMedicalCheckupByName(
    value: string,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchPendingMedicalCheckupByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              pendingCheckupList: this.state.pendingCheckupList.concat(
                data.items
              ),
            });
          } else {
            this.store.showNotif('No result found!', 'custome');
          }
          console.log('Infite searched list');
          console.log(this.state.pendingCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupPendingItems: data.totalItems });
          this.setState({ totalCheckupPendingPages: data.totalPages });
          this.setState({ currentCheckupPendingPage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }
  //
  searchPendingMedicalCheckupByNameAndCustomerID(
    value: string,
    page: number,
    size: number,
    customerID: string
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchPendingMedicalCheckupByNameByCustomerID(
        value,
        page,
        size,
        customerID
      )
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              pendingCheckupList: this.fillEmpty(
                page,
                size,
                this.state.pendingCheckupList,
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
          this.setState({ totalCheckupPendingItems: data.totalItems });
          this.setState({ totalCheckupPendingPages: data.totalPages });
          this.setState({ currentCheckupPendingPage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  searchPendingInfiniteMedicalCheckupByNameAndCustomerID(
    value: string,
    page: number,
    size: number,
    customerID: string
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchPendingMedicalCheckupByNameByCustomerID(
        value,
        page,
        size,
        customerID
      )
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              pendingCheckupList: this.state.pendingCheckupList.concat(
                data.items
              ),
            });
          } else {
            this.store.showNotif('No result found!', 'custome');
          }
          console.log('Infite searched list');
          console.log(this.state.pendingCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupPendingItems: data.totalItems });
          this.setState({ totalCheckupPendingPages: data.totalPages });
          this.setState({ currentCheckupPendingPage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }
  //
  searchCompleteMedicalCheckupByName(
    value: string,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchCompleteMedicalCheckupByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              completeCheckupList: this.fillEmpty(
                page,
                size,
                this.state.completeCheckupList,
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
          this.setState({ totalCheckupCompleteItems: data.totalItems });
          this.setState({ totalCheckupCompletePages: data.totalPages });
          this.setState({ currentCheckupCompletePage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  searchCompleteInfiniteMedicalCheckupByName(
    value: string,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchCompleteMedicalCheckupByName(value, page, size)
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              completeCheckupList: this.state.completeCheckupList.concat(
                data.items
              ),
            });
          } else {
            this.store.showNotif('No result found!', 'custome');
          }
          console.log('Infite searched list');
          console.log(this.state.completeCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupCompleteItems: data.totalItems });
          this.setState({ totalCheckupCompletePages: data.totalPages });
          this.setState({ currentCheckupCompletePage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }
  //
  searchCompleteMedicalCheckupByNameAndCustomerID(
    value: string,
    page: number,
    size: number,
    customerID: string
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchCompleteMedicalCheckupByNameByCustomerID(
        value,
        page,
        size,
        customerID
      )
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              completeCheckupList: this.fillEmpty(
                page,
                size,
                this.state.completeCheckupList,
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
          this.setState({ totalCheckupCompleteItems: data.totalItems });
          this.setState({ totalCheckupCompletePages: data.totalPages });
          this.setState({ currentCheckupCompletePage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  searchCompleteInfiniteMedicalCheckupByNameAndCustomerID(
    value: string,
    page: number,
    size: number,
    customerID: string
  ) {
    this.setIsLoading(true);
    this.medicalCheckupService
      .searchCompleteMedicalCheckupByNameByCustomerID(
        value,
        page,
        size,
        customerID
      )
      .subscribe({
        next: (data: any) => {
          if (data.totalItems !== 0) {
            this.setState({
              completeCheckupList: this.state.completeCheckupList.concat(
                data.items
              ),
            });
          } else {
            this.store.showNotif('No result found!', 'custome');
          }
          console.log('Infite searched list');
          console.log(this.state.completeCheckupList);
          console.log('Server response');
          console.log(data);
          this.setState({ totalCheckupCompleteItems: data.totalItems });
          this.setState({ totalCheckupCompletePages: data.totalPages });
          this.setState({ currentCheckupCompletePage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }
  //
  setIsPrescriptionDone(isDone: boolean) {
    this.setState({ isPrescriptionDone: isDone });
  }

  setExportData(array: Array<MedicalCheckup>) {
    this.setState({ medicalCheckupList: array });
  }
}
