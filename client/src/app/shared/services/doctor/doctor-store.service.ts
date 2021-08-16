import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../models/doctor';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { DoctorHttpService } from './doctor-http.service';
import { confirm } from 'devextreme/ui/dialog';
import { ImageStore } from '../image/image-store.service';

interface DoctorState {
  doctorList: Array<Doctor>;
  exportData: Array<Doctor>;
  doctorInstance: Doctor;
  selectedDoctor: Object;
  roleStatistics: Array<Object>;
  departmentStatistics: Array<Object>;
  genderStatistics: Array<Object>;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: DoctorState = {
  doctorList: [],
  selectedDoctor: {},
  doctorInstance: undefined,
  exportData: [],
  roleStatistics: [],
  departmentStatistics: [],
  genderStatistics: [],
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
    private store: StoreService,
    private imageStore: ImageStore
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
    sourceArray: Array<Doctor>,
    addedArray: Array<Doctor>
  ): Array<Doctor> {
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

  initInfiniteData(page: number, size: number) {
    this.store.setIsLoading(true);
    return this.doctorService
      .fetchDoctor(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          doctorList: new Array<Doctor>(data.items.length),
        });
        this.imageStore.fetchSelectedImages(data.items);
        console.log('Current flag: infite list');
        console.log(this.state.doctorList);
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
    this.doctorService.fetchDoctor(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          doctorList: this.state.doctorList.concat(data.items),
        });
        this.imageStore.fetchSelectedImages(data.items);
        console.log('Infinite list');
        console.log(this.state.doctorList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        // this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
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

  initInfiniteFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.doctorService
      .filterDoctorByCategory(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          doctorList: new Array<Doctor>(data.items.length),
        });
        console.log('Current flag: infinite filtered list');
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

  initInfiniteSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.doctorService
      .searchDoctorByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            doctorList: new Array<Doctor>(data.items.length),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
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

  initInfiniteSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.doctorService
      .sortDoctorByPrice(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          doctorList: new Array<Doctor>(data.items.length),
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

  $departmentStatistics: Observable<Array<Object>> = this.select(
    (state) => state.departmentStatistics
  );

  $roleStatistics: Observable<Array<Object>> = this.select(
    (state) => state.roleStatistics
  );

  $genderStatistics: Observable<Array<Object>> = this.select(
    (state) => state.genderStatistics
  );

  $exportData: Observable<Array<Doctor>> = this.select(
    (state) => state.exportData
  );

  $doctorInstance: Observable<Doctor> = this.select(
    (state) => state.doctorInstance
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
        this.doctorService.deleteSelectedDoctors(selectedDoctors).subscribe({
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

  getDoctor(id: string) {
    this.setIsLoading(true);
    return this.doctorService
      .getDoctor(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ doctorInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  getDoctorByUserName(userName: string) {
    this.setIsLoading(true);
    return this.doctorService
      .getDoctorByUserName(userName)
      .toPromise()
      .then((data: any) => {
        this.setState({ doctorInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
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

  filterInfiniteDoctorByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.doctorService.filterDoctorByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          doctorList: this.state.doctorList.concat(data.items),
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

  searchInfiniteDoctorByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.doctorService.searchDoctorByName(value, page, size).subscribe({
      next: (data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            doctorList: this.state.doctorList.concat(data.items),
          });
        } else {
          this.store.showNotif('No result found!', 'custome');
        }
        console.log('Infite searched list');
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

  sortInfiniteDoctorByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.doctorService.sortDoctorByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          doctorList: this.state.doctorList.concat(data.items),
        });
        console.log('Infite sorted list');
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

  getRoleCount(value: string) {
    this.store.setIsLoading(true);
    return this.doctorService
      .filterDoctorByRole(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          roleStatistics: this.state.roleStatistics.concat({
            role: value,
            totalCount: data.totalItems,
          }),
        });
        this.store.setIsLoading(false);
      });
  }

  getRoleStatistics() {
    const roleList = ['Doctor', 'Nurses', 'Assistants'];
    this.setState({ roleStatistics: [] });
    roleList.forEach((element) => {
      this.getRoleCount(element);
    });
  }

  getDepartmentCount(value: string) {
    this.store.setIsLoading(true);
    return this.doctorService
      .filterDoctorByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          departmentStatistics: this.state.departmentStatistics.concat({
            department: value,
            totalCount: data.totalItems,
          }),
        });
        this.store.setIsLoading(false);
      });
  }

  getDepartmentStatistics() {
    const departmentList = [
      'Dermatology',
      'Oncology',
      'Endocrinology',
      'Gastroenterology',
      'Hepato-Biliary-Pancreatic',
      'Neurology',
      'Respiratory',
      'Infectious',
      'Ophthalmology',
    ];
    this.setState({ departmentStatistics: [] });
    departmentList.forEach((element) => {
      this.getDepartmentCount(element);
    });
  }

  getGenderCount(value: string) {
    this.store.setIsLoading(true);
    return this.doctorService
      .filterDoctorByGender(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          genderStatistics: this.state.genderStatistics.concat({
            gender: value,
            totalCount: data.totalItems,
          }),
        });
        this.store.setIsLoading(false);
      });
  }

  getGenderStatistics() {
    const genderList = ['Male', 'Female'];
    this.setState({ genderStatistics: [] });
    genderList.forEach((element) => {
      this.getGenderCount(element);
    });
  }

  setExportData(array: Array<Doctor>) {
    this.setState({ doctorList: array });
  }
}
