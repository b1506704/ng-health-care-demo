import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Schedule } from '../../models/schedule';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { ScheduleHttpService } from './schedule-http.service';
import { confirm } from 'devextreme/ui/dialog';

interface ScheduleState {
  scheduleList: Array<Schedule>;
  exportData: Array<Schedule>;
  selectedSchedule: Object;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: ScheduleState = {
  scheduleList: [],
  selectedSchedule: {},
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class ScheduleStore extends StateService<ScheduleState> {
  constructor(
    private scheduleService: ScheduleHttpService,
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
    sourceArray: Array<Schedule>,
    addedArray: Array<Schedule>
  ): Array<Schedule> {
    let result: Array<Schedule> = sourceArray;
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
    this.scheduleService
      .fetchSchedule(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          scheduleList: new Array<Schedule>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.scheduleList);
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
    this.scheduleService
      .filterScheduleByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          scheduleList: new Array<Schedule>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.scheduleList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterScheduleByCategory(value, page, size);
      });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.scheduleService
      .searchScheduleByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          scheduleList: new Array<Schedule>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.scheduleList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchScheduleByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.scheduleService
      .sortScheduleByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          scheduleList: new Array<Schedule>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.scheduleList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortScheduleByPrice(value, page, size);
      });
  }

  initSortByName(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.scheduleService
      .sortScheduleByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          scheduleList: new Array<Schedule>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.scheduleList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortScheduleByName(value, page, size);
      });
  }


  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.scheduleService.fetchSchedule(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          scheduleList: this.fillEmpty(
            page,
            size,
            this.state.scheduleList,
            data.items
          ),
        });
        console.log('Pure list');
        console.log(this.state.scheduleList);
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
    this.scheduleService.fetchSchedule(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          scheduleList: this.fillEmpty(
            page,
            size,
            this.state.scheduleList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.scheduleList);
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

  $scheduleList: Observable<Array<Schedule>> = this.select(
    (state) => state.scheduleList
  );

  $exportData: Observable<Array<Schedule>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedSchedule: Observable<Object> = this.select(
    (state) => state.selectedSchedule
  );

  uploadSchedule(schedule: Schedule, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.scheduleService.uploadSchedule(schedule).subscribe({
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

  updateSchedule(schedule: Schedule, key: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.scheduleService.updateSchedule(schedule, key).subscribe({
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

  deleteSelectedSchedules(
    selectedSchedules: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.scheduleService
          .deleteSelectedSchedules(selectedSchedules)
          .subscribe({
            next: (data: any) => {
              this.setState({ responseMsg: data });
              console.log(data);
              this.loadDataAsync(page, size);
              console.log(this.state.scheduleList);
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

  deleteAllSchedules() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.scheduleService.deleteAllSchedules().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ scheduleList: [] });
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

  deleteSchedule(id: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.scheduleService.deleteSchedule(id).subscribe({
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

  selectSchedule(_schedule: Schedule) {
    this.setState({ selectedSchedule: _schedule });
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

  getSchedule(id: string | number) {
    return this.$scheduleList.pipe(
      map(
        (schedules: Array<Schedule>) =>
          schedules.find((schedule) => schedule._id === id)!
      )
    );
  }

  filterScheduleByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.scheduleService
      .filterScheduleByPrice(criteria, value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            scheduleList: this.fillEmpty(
              page,
              size,
              this.state.scheduleList,
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

  filterScheduleByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.scheduleService.filterScheduleByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          scheduleList: this.fillEmpty(
            page,
            size,
            this.state.scheduleList,
            data.items
          ),
        });
        console.log('Filtered list');
        console.log(this.state.scheduleList);
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

  searchScheduleByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.scheduleService.searchScheduleByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          scheduleList: this.fillEmpty(
            page,
            size,
            this.state.scheduleList,
            data.items
          ),
        });
        console.log('Searched list');
        console.log(this.state.scheduleList);
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

  sortScheduleByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.scheduleService.sortScheduleByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          scheduleList: this.fillEmpty(
            page,
            size,
            this.state.scheduleList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.scheduleList);
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

  sortScheduleByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.scheduleService.sortScheduleByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          scheduleList: this.fillEmpty(
            page,
            size,
            this.state.scheduleList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.scheduleList);
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

  setExportData(array: Array<Schedule>) {
    this.setState({ scheduleList: array });
  }
}
