import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Schedule } from 'src/app/shared/models/schedule';
import { ScheduleHttpService } from 'src/app/shared/services/schedule/schedule-http.service';
import { ScheduleStore } from 'src/app/shared/services/schedule/schedule-store.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
})
export class ScheduleListComponent implements OnInit, OnDestroy {
  //TODO: rewrite fetching logic: by date, find yourself
  scheduleList!: Array<Schedule>;
  pageSize: number = 100;
  doctorName: Array<Object> = [
    { name: 'Dr. Elon Musk' },
    { name: 'Dr. Tim Cahill' },
    { name: 'Dr. David De Gea' },
    { name: 'Dr. Manuel Neuer' },
    { name: 'Dr. Phi Minh Long' },
    { name: 'Dr. Au Trung' },
    { name: 'Dr. Thach Sung' },
    { name: 'Dr. Alien' },
    { name: 'Dr. Predator' },
  ];
  allowedPageSizes: Array<number | string> = [5, 10, 15];
  // standard | virtual | infinite
  currentIndexFromServer: number;
  isSearchingByName: boolean;
  isFilteringByCategory: boolean;
  isFilteringByPrice: boolean;
  isSortingByName: boolean;
  isSortingByPrice: boolean;
  currentDate: Date = new Date(2021, 2, 28);
  currentCategoryFilterValue: string;
  timeout: any;
  currentSearchByNameValue: string;
  currentSortByPriceValue: string;

  isEdit: boolean = false;

  searchBoxOptions: any = {
    valueChangeEvent: 'keyup',
    showClearButton: true,
    onKeyUp: this.onSearchKeyupHandler.bind(this),
    onValueChanged: this.onSearchValueChanged.bind(this),
    mode: 'search',
    placeholder: 'Search with name',
  };

  refreshButtonOptions: any = {
    type: 'normal',
    icon: 'refresh',
    hint: 'Fetch data from server',
    onClick: this.onRefresh.bind(this),
  };

  filterSelectBoxOptions: any = {
    items: this.doctorName,
    valueExpr: '_id',
    // searchExpr: 'name',
    displayExpr: 'name',
    placeholder: 'Filter with doctor name',
    // searchEnabled: true,
    onValueChanged: this.onFilterChange.bind(this),
  };

  sortSelectBoxOptions: any = {
    items: [
      {
        _id: '-1',
        name: '(NONE)',
      },
      { _id: '0', name: 'ASC' },
      { _id: '1', name: 'DESC' },
    ],
    valueExpr: 'name',
    placeholder: 'Sort room',
    displayExpr: 'name',
    onValueChanged: this.onSortValueChanged.bind(this),
  };

  constructor(
    private scheduleStore: ScheduleStore,
    private store: StoreService,
    private scheduleHTTP: ScheduleHttpService,
    private router: Router
  ) {}

  onSearchKeyupHandler(e: any) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.isSearchingByName = true;
      this.isFilteringByCategory = false;
      this.isSortingByPrice = false;
      console.log(this.currentSearchByNameValue);
      if (this.currentSearchByNameValue !== '') {
        this.scheduleStore.initSearchByNameData(
          this.currentSearchByNameValue,
          this.currentIndexFromServer,
          this.pageSize
        );
      } else {
        //return to pure editor mode
        this.store.showNotif('SEARCH MODE OFF', 'custom');
        this.onRefresh();
      }
    }, 1250);
  }

  onSearchValueChanged(e: any) {
    this.currentSearchByNameValue = e.value;
  }

  onSortValueChanged(e: any) {
    this.isSortingByPrice = true;
    this.isSearchingByName = false;
    this.isFilteringByCategory = false;
    this.currentSortByPriceValue = e.value;
    if (e.value !== '(NONE)') {
      this.scheduleStore.initSortByPriceData(
        e.value,
        this.currentIndexFromServer,
        this.pageSize
      );
    } else {
      //return to pure editor mode
      this.store.showNotif('SORT MODE OFF', 'custom');
      this.onRefresh();
    }
  }

  onFilterChange(e: any) {
    this.isFilteringByCategory = true;
    this.isSearchingByName = false;
    this.isSortingByPrice = false;
    this.currentCategoryFilterValue = e.value;
    console.log(e.value);
    if (e.value !== '-1') {
      this.scheduleStore.initFilterByCategoryData(
        e.value,
        this.currentIndexFromServer,
        this.pageSize
      );
    } else {
      //return to pure editor mode
      this.store.showNotif('FILTER MODE OFF', 'custom');
      this.onRefresh();
    }
  }

  checkEditorMode() {
    if (this.isFilteringByCategory === true) {
      return 'FILTER';
    } else if (this.isSearchingByName === true) {
      return 'SEARCH';
    } else if (this.isSortingByPrice === true) {
      return 'SORT';
    } else {
      return 'NORMAL';
    }
  }

  onOptionChanged(e: any) {
    const editorMode = this.checkEditorMode();
    if (e.fullName === 'currentDate') {
      const currentIndex: number = this.currentIndexFromServer + 1;
      switch (editorMode) {
        case 'NORMAL':
          this.paginatePureData(currentIndex);
          break;
        case 'FILTER':
          this.paginateFilterData(currentIndex);
          break;
        case 'SEARCH':
          this.paginateSearchData(currentIndex);
          break;
        case 'SORT':
          this.paginateSortData(currentIndex);
          break;
        default:
          break;
      }
    }
  }

  onAppointmentClick(e: any) {
    this.store.showNotif(`Room: ${e.targetedAppointmentData.room}`, 'custom');
  }

  onAppointmentDblClick(e: any) {
    e.cancel = true;
  }

  paginatePureData(index: number) {
    if (index === 0) {
      this.scheduleStore.loadDataAsync(index, this.pageSize);
      this.scheduleStore.loadDataAsync(index + 1, this.pageSize);
    } else {
      this.scheduleStore.loadDataAsync(index, this.pageSize);
      this.scheduleStore.loadDataAsync(index + 1, this.pageSize);
      this.scheduleStore.loadDataAsync(index - 1, this.pageSize);
    }
  }

  paginateFilterData(index: number) {
    if (index === 0) {
      this.scheduleStore.filterScheduleByCategory(
        this.currentCategoryFilterValue,
        index,
        this.pageSize
      );
      this.scheduleStore.filterScheduleByCategory(
        this.currentCategoryFilterValue,
        index + 1,
        this.pageSize
      );
    } else {
      this.scheduleStore.filterScheduleByCategory(
        this.currentCategoryFilterValue,
        index,
        this.pageSize
      );
      this.scheduleStore.filterScheduleByCategory(
        this.currentCategoryFilterValue,
        index + 1,
        this.pageSize
      );
      this.scheduleStore.filterScheduleByCategory(
        this.currentCategoryFilterValue,
        index - 1,
        this.pageSize
      );
    }
  }

  paginateSearchData(index: number) {
    if (index === 0) {
      this.scheduleStore.searchScheduleByName(
        this.currentSearchByNameValue,
        index,
        this.pageSize
      );
      this.scheduleStore.searchScheduleByName(
        this.currentSearchByNameValue,
        index + 1,
        this.pageSize
      );
    } else {
      this.scheduleStore.searchScheduleByName(
        this.currentSearchByNameValue,
        index,
        this.pageSize
      );
      this.scheduleStore.searchScheduleByName(
        this.currentSearchByNameValue,
        index + 1,
        this.pageSize
      );
      this.scheduleStore.searchScheduleByName(
        this.currentSearchByNameValue,
        index - 1,
        this.pageSize
      );
    }
  }

  paginateSortData(index: number) {
    if (index === 0) {
      this.scheduleStore.sortScheduleByPrice(
        this.currentSortByPriceValue,
        index,
        this.pageSize
      );
      this.scheduleStore.sortScheduleByPrice(
        this.currentSortByPriceValue,
        index + 1,
        this.pageSize
      );
    } else {
      this.scheduleStore.sortScheduleByPrice(
        this.currentSortByPriceValue,
        index,
        this.pageSize
      );
      this.scheduleStore.sortScheduleByPrice(
        this.currentSortByPriceValue,
        index + 1,
        this.pageSize
      );
      this.scheduleStore.sortScheduleByPrice(
        this.currentSortByPriceValue,
        index - 1,
        this.pageSize
      );
    }
  }

  onRefresh() {
    this.isFilteringByCategory = false;
    this.isSearchingByName = false;
    this.isSortingByPrice = false;
    this.scheduleStore.initData(this.currentIndexFromServer, this.pageSize);
  }

  navigateToHealthCondition() {
    this.router.navigate(['/health_condition']);
  }

  sourceDataListener() {
    return this.scheduleStore.$scheduleList.subscribe((data: any) => {
      this.scheduleList = data;
    });
  }

  currentPageListener() {
    return this.scheduleStore.$currentPage.subscribe((data: any) => {
      this.currentIndexFromServer = data;
    });
  }

  ngOnInit(): void {
    this.sourceDataListener();
    this.currentPageListener();
    setTimeout(() => {
      this.onRefresh();
    }, 150);
  }

  ngOnDestroy(): void {
    this.sourceDataListener().unsubscribe();
    this.currentPageListener().unsubscribe();
  }
}
