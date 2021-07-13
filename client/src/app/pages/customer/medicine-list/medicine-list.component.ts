import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Medicine } from 'src/app/shared/models/medicine';
import { MedicineHttpService } from 'src/app/shared/services/medicine/medicine-http.service';
import { MedicineStore } from 'src/app/shared/services/medicine/medicine-store.service';
import { StoreService } from 'src/app/shared/services/store.service';
import brandList from 'src/app/shared/services/medicine/mock-brand';
import { DxScrollViewComponent } from 'devextreme-angular';

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.scss'],
})
export class MedicineListComponent implements OnInit, OnDestroy {
  @ViewChild(DxScrollViewComponent, { static: false })
  scrollView: DxScrollViewComponent;
  medicineList!: Array<Medicine>;
  brandList: Array<Object> = brandList();
  pageSize: number = 5;
  allowedPageSizes: Array<number | string> = [5, 10, 15];
  pullDown = false;
  updateContentTimer: any;
  scrollingMode: string = 'standard';
  // standard | virtual | infinite
  currentIndexFromServer: number;
  isSearchingByName: boolean;
  isFilteringByCategory: boolean;
  isFilteringByPrice: boolean;
  isSortingByName: boolean;
  isSortingByPrice: boolean;

  currentCategoryFilterValue: string;
  timeout: any;
  currentSearchByNameValue: string;
  currentSortByPriceValue: string;
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
    items: this.brandList,
    valueExpr: '_id',
    // searchExpr: 'name',
    displayExpr: 'name',
    placeholder: 'Filter with brand',
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
    placeholder: 'Sort price',
    displayExpr: 'name',
    onValueChanged: this.onSortValueChanged.bind(this),
  };

  constructor(
    private medicineStore: MedicineStore,
    private store: StoreService,
    private medicineHTTP: MedicineHttpService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.scrollView.instance.option('onReachBottom', this.updateBottomContent);
  }
  valueChanged = (data: any) => {
    this.scrollView.instance.option(
      'onReachBottom',
      data.value ? this.updateBottomContent : null
    );
  };

  updateContent = (args: any, eventName: any) => {
    if (this.updateContentTimer) clearTimeout(this.updateContentTimer);
    this.updateContentTimer = setTimeout(() => {
      if (eventName == 'PullDown') {
        this.paginatePureData(this.currentIndexFromServer + 1);
      } else {
        this.paginatePureData(this.currentIndexFromServer + 1);
      }
      args.component.release();
    }, 500);
  };
  updateTopContent = (e: any) => {
    this.updateContent(e, 'PullDown');
  };
  updateBottomContent = (e: any) => {
    this.updateContent(e, 'ReachBottom');
  };

  onSearchKeyupHandler(e: any) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.isSearchingByName = true;
      this.isFilteringByCategory = false;
      this.isSortingByPrice = false;
      console.log(this.currentSearchByNameValue);
      if (this.currentSearchByNameValue !== '') {
        this.medicineStore.initSearchByNameData(
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
      this.medicineStore.initSortByPriceData(
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
      this.medicineStore.initFilterByCategoryData(
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
    // event of page index changed
    if (e.fullName === 'paging.pageIndex') {
      const currentIndex: number = e.value;
      console.log(
        `New page index: ${currentIndex}. Total items: ${this.medicineList.length}`
      );
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
    // todo: handle virtual scrolling when pagesize = 'all'
    //
    // event of page size changed by user's click
  }

  paginatePureData(index: number) {
    if (index === 0) {
      this.medicineStore.loadDataAsync(index, this.pageSize);
      this.medicineStore.loadDataAsync(index + 1, this.pageSize);
    } else {
      this.medicineStore.loadDataAsync(index, this.pageSize);
      this.medicineStore.loadDataAsync(index + 1, this.pageSize);
      this.medicineStore.loadDataAsync(index - 1, this.pageSize);
    }
  }

  paginateFilterData(index: number) {
    if (index === 0) {
      this.medicineStore.filterMedicineByCategory(
        this.currentCategoryFilterValue,
        index,
        this.pageSize
      );
      this.medicineStore.filterMedicineByCategory(
        this.currentCategoryFilterValue,
        index + 1,
        this.pageSize
      );
    } else {
      this.medicineStore.filterMedicineByCategory(
        this.currentCategoryFilterValue,
        index,
        this.pageSize
      );
      this.medicineStore.filterMedicineByCategory(
        this.currentCategoryFilterValue,
        index + 1,
        this.pageSize
      );
      this.medicineStore.filterMedicineByCategory(
        this.currentCategoryFilterValue,
        index - 1,
        this.pageSize
      );
    }
  }

  paginateSearchData(index: number) {
    if (index === 0) {
      this.medicineStore.searchMedicineByName(
        this.currentSearchByNameValue,
        index,
        this.pageSize
      );
      this.medicineStore.searchMedicineByName(
        this.currentSearchByNameValue,
        index + 1,
        this.pageSize
      );
    } else {
      this.medicineStore.searchMedicineByName(
        this.currentSearchByNameValue,
        index,
        this.pageSize
      );
      this.medicineStore.searchMedicineByName(
        this.currentSearchByNameValue,
        index + 1,
        this.pageSize
      );
      this.medicineStore.searchMedicineByName(
        this.currentSearchByNameValue,
        index - 1,
        this.pageSize
      );
    }
  }

  paginateSortData(index: number) {
    if (index === 0) {
      this.medicineStore.sortMedicineByPrice(
        this.currentSortByPriceValue,
        index,
        this.pageSize
      );
      this.medicineStore.sortMedicineByPrice(
        this.currentSortByPriceValue,
        index + 1,
        this.pageSize
      );
    } else {
      this.medicineStore.sortMedicineByPrice(
        this.currentSortByPriceValue,
        index,
        this.pageSize
      );
      this.medicineStore.sortMedicineByPrice(
        this.currentSortByPriceValue,
        index + 1,
        this.pageSize
      );
      this.medicineStore.sortMedicineByPrice(
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
    this.medicineStore.initData(this.currentIndexFromServer, this.pageSize);
  }

  navigateToDoctor() {
    this.router.navigate(['/doctor_list']);
  }

  sourceDataListener() {
    return this.medicineStore.$medicineList.subscribe((data: any) => {
      this.medicineList = data;
    });
  }

  currentPageListener() {
    return this.medicineStore.$currentPage.subscribe((data: any) => {
      this.currentIndexFromServer = data;
    });
  }

  ngOnInit(): void {
    this.sourceDataListener();
    this.currentPageListener();
  }

  ngOnDestroy(): void {
    this.sourceDataListener().unsubscribe();
    this.currentPageListener().unsubscribe();
  }
}
