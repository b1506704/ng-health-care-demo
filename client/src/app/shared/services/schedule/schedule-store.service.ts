import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Schedule } from '../../models/schedule';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { ScheduleHttpService } from './schedule-http.service';

interface ScheduleState {
  scheduleList: Array<Schedule>;
  filteredScheduleList: Array<Schedule>;
  searchedScheduleList: Array<Schedule>;
  selectedSchedule: Object;
  responseMsg: String;
}
const initialState: ScheduleState = {
  scheduleList: [],
  filteredScheduleList: [],
  searchedScheduleList: [],
  selectedSchedule: {},
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
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.scheduleService.fetchSchedule().subscribe({
      next: (data: any) => {
        this.setState({ scheduleList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotif('Load schedule successfully', 'custom');
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $scheduleList: Observable<Array<Schedule>> = this.select(
    (state) => state.scheduleList
  );

  $filteredScheduleList: Observable<Array<Schedule>> = this.select(
    (state) => state.filteredScheduleList
  );

  $searchedScheduleList: Observable<Array<Schedule>> = this.select(
    (state) => state.searchedScheduleList
  );

  $selectedSchedule: Observable<Object> = this.select(
    (state) => state.selectedSchedule
  );

  uploadSchedule(schedule: Schedule) {
    this.setIsLoading(true);
    this.scheduleService.uploadSchedule(schedule).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  updateSchedule(schedule: Schedule) {
    this.setIsLoading(true);
    this.scheduleService.updateSchedule(schedule).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  deleteSchedule(schedule: Schedule) {
    this.setIsLoading(true);
    this.scheduleService.deleteSchedule(schedule).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  selectSchedule(_schedule: Schedule) {
    this.setState({ selectedSchedule: _schedule });
  }

  getSchedule(id: string | number) {
    return this.$scheduleList.pipe(
      map(
        (schedules: Array<Schedule>) =>
          schedules.find((schedule) => schedule.id === id)!
      )
    );
  }

  filterSchedule(_scheduleList: Array<Schedule>, _criteria: string) {
    this.setState({ filteredScheduleList: _scheduleList });
  }

  searchSchedule(_scheduleList: Array<Schedule>, _criteria: string) {
    this.setState({ searchedScheduleList: _scheduleList });
  }
}
