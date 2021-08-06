import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Medicine } from 'src/app/shared/models/medicine';
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
  currentMedicineID!: string;
  // item loaded per pull down event
  pageSize: number = 10;
  pullDown = false;
  updateContentTimer: any;
  // standard | virtual | infinite
  currentIndexFromServer: number;
  isSearchingByName: boolean;
  isFilteringByCategory: boolean;
  isFilteringByPrice: boolean;
  isSortingByName: boolean;
  isSortingByPrice: boolean;
  isDetailPopupVisible: boolean = false;

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
    valueExpr: 'name',
    displayExpr: 'name',
    placeholder: 'Filter with brand',
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
  currency: string = '$'; 

  constructor(
    private medicineStore: MedicineStore,
    private store: StoreService,
    private router: Router
  ) {}

  selectMedicine(_id: string) {
    this.currentMedicineID = _id;
    console.log('SELECTED ID');
    console.log(_id);
    // setTimeout(() => {
    this.isDetailPopupVisible = true;
    // }, 1000);
  }

  updateContent = (args: any, eventName: any) => {
    const editorMode = this.checkEditorMode();
    const currentIndex = this.currentIndexFromServer;
    if (this.updateContentTimer) clearTimeout(this.updateContentTimer);
    this.updateContentTimer = setTimeout(() => {
      if (this.medicineList.length) {
        switch (editorMode) {
          case 'NORMAL':
            this.paginatePureData(currentIndex + 1);
            break;
          case 'FILTER':
            this.paginateFilterData(currentIndex + 1);
            break;
          case 'SEARCH':
            this.paginateSearchData(currentIndex + 1);
            break;
          case 'SORT':
            this.paginateSortData(currentIndex + 1);
            break;
          default:
            break;
        }
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
        this.medicineStore.initInfiniteSearchByNameData(
          this.currentSearchByNameValue,
          0,
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
      this.medicineStore.initInfiniteSortByPriceData(e.value, 0, this.pageSize);
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
    if (e.value !== '(NONE)') {
      this.medicineStore.initInfiniteFilterByCategoryData(
        e.value,
        0,
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

  paginatePureData(index: number) {
    this.medicineStore.loadInfiniteDataAsync(index, this.pageSize);
  }

  paginateFilterData(index: number) {
    this.medicineStore.filterInfiniteMedicineByCategory(
      this.currentCategoryFilterValue,
      index,
      this.pageSize
    );
  }

  paginateSearchData(index: number) {
    this.medicineStore.searchInfiniteMedicineByName(
      this.currentSearchByNameValue,
      index,
      this.pageSize
    );
  }

  paginateSortData(index: number) {
    this.medicineStore.sortInfiniteMedicineByPrice(
      this.currentSortByPriceValue,
      index,
      this.pageSize
    );
  }

  onRefresh() {
    this.isFilteringByCategory = false;
    this.isSearchingByName = false;
    this.isSortingByPrice = false;
    this.medicineStore.initInfiniteData(0, this.pageSize);
  }

  navigateToDoctorSchedule() {
    this.router.navigate(['/doctor_schedule']);
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

  scrollTop() {
    this.scrollView.instance.scrollTo({ top: 0, left: 0 });
  }

  ngOnInit(): void {
    this.currentPageListener();
    this.medicineStore.initInfiniteData(0, this.pageSize).then(() => {
      this.sourceDataListener();
    });
  }

  ngOnDestroy(): void {
    this.sourceDataListener().unsubscribe();
    this.currentPageListener().unsubscribe();
  }
}
