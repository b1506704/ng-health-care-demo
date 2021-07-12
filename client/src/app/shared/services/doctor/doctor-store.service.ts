import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Doctor } from '../../models/doctor';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { DoctorHttpService } from './doctor-http.service';
import { confirm } from 'devextreme/ui/dialog';

interface DoctorState {
  doctorList: Array<Doctor>;
  exportData: Array<Doctor>;
  selectedDoctor: Object;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: DoctorState = {
  doctorList: [],
  selectedDoctor: {},
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class DoctorStore extends StateService<DoctorState> {
  constructor(
    private doctorService: DoctorHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.initData(0, 5);
  }

  fillEmpty(
    startIndex: number,
    endIndex: number,
    sourceArray: Array<Doctor>,
    addedArray: Array<Doctor>
  ) {
    let result: Array<Doctor> = sourceArray;
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

  initData(page: number, size: number) {
    this.doctorService
      .fetchDoctor(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          doctorList: new Array<Doctor>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.doctorList);
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
    this.doctorService
      .filterDoctorByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          doctorList: new Array<Doctor>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.doctorList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterDoctorByCategory(value, page, size);
      });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.doctorService
      .searchDoctorByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          doctorList: new Array<Doctor>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.doctorList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchDoctorByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.doctorService
      .sortDoctorByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          doctorList: new Array<Doctor>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.doctorList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortDoctorByPrice(value, page, size);
      });
  }

  initSortByName(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.doctorService
      .sortDoctorByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          doctorList: new Array<Doctor>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.doctorList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortDoctorByName(value, page, size);
      });
  }


  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.doctorService.fetchDoctor(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          doctorList: this.fillEmpty(
            page,
            size,
            this.state.doctorList,
            data.items
          ),
        });
        console.log('Pure list');
        console.log(this.state.doctorList);
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
    this.doctorService.fetchDoctor(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          doctorList: this.fillEmpty(
            page,
            size,
            this.state.doctorList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.doctorList);
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

  $doctorList: Observable<Array<Doctor>> = this.select(
    (state) => state.doctorList
  );

  $exportData: Observable<Array<Doctor>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedDoctor: Observable<Object> = this.select(
    (state) => state.selectedDoctor
  );

  uploadDoctor(doctor: Doctor, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.doctorService.uploadDoctor(doctor).subscribe({
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

  updateDoctor(doctor: Doctor, key: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.doctorService.updateDoctor(doctor, key).subscribe({
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

  deleteSelectedDoctors(
    selectedDoctors: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.doctorService
          .deleteSelectedDoctors(selectedDoctors)
          .subscribe({
            next: (data: any) => {
              this.setState({ responseMsg: data });
              console.log(data);
              this.loadDataAsync(page, size);
              console.log(this.state.doctorList);
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

  deleteAllDoctors() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.doctorService.deleteAllDoctors().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ doctorList: [] });
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

  deleteDoctor(id: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.doctorService.deleteDoctor(id).subscribe({
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

  selectDoctor(_doctor: Doctor) {
    this.setState({ selectedDoctor: _doctor });
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

  getDoctor(id: string | number) {
    return this.$doctorList.pipe(
      map(
        (doctors: Array<Doctor>) =>
          doctors.find((doctor) => doctor._id === id)!
      )
    );
  }

  filterDoctorByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.doctorService
      .filterDoctorByPrice(criteria, value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            doctorList: this.fillEmpty(
              page,
              size,
              this.state.doctorList,
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

  filterDoctorByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.doctorService.filterDoctorByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          doctorList: this.fillEmpty(
            page,
            size,
            this.state.doctorList,
            data.items
          ),
        });
        console.log('Filtered list');
        console.log(this.state.doctorList);
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

  searchDoctorByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.doctorService.searchDoctorByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          doctorList: this.fillEmpty(
            page,
            size,
            this.state.doctorList,
            data.items
          ),
        });
        console.log('Searched list');
        console.log(this.state.doctorList);
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

  sortDoctorByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.doctorService.sortDoctorByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          doctorList: this.fillEmpty(
            page,
            size,
            this.state.doctorList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.doctorList);
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

  sortDoctorByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.doctorService.sortDoctorByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          doctorList: this.fillEmpty(
            page,
            size,
            this.state.doctorList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.doctorList);
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

  setExportData(array: Array<Doctor>) {
    this.setState({ doctorList: array });
  }
}
