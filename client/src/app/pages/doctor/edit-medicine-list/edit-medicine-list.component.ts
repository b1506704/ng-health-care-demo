import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { Medicine } from 'src/app/shared/models/medicine';
import { MedicineHttpService } from 'src/app/shared/services/medicine/medicine-http.service';
import { MedicineStore } from 'src/app/shared/services/medicine/medicine-store.service';
import { StoreService } from 'src/app/shared/services/store.service';
import brandList from 'src/app/shared/services/medicine/mock-brand';

@Component({
  selector: 'app-edit-medicine-list',
  templateUrl: './edit-medicine-list.component.html',
  styleUrls: ['./edit-medicine-list.component.scss'],
})
export class EditMedicineListComponent implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  medicineList!: Array<Medicine>;
  brandList: Array<Object> = brandList();
  selectedRows: string[];
  isSelectInfoVisible: boolean;
  selectInfoText: String;
  selectedCellRow: Object;
  pageSize: number = 5;
  allowedPageSizes: Array<number | string> = [5, 10, 15];
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
  currentSearchValue: string;

  constructor(
    private medicineStore: MedicineStore,
    private store: StoreService,
    private medicineHTTP: MedicineHttpService,
    private router: Router
  ) {}

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        template: 'totalMedicineCount',
      },
      {
        location: 'after',
        locateInMenu: 'auto',
        widget: 'dxButton',
        options: {
          type: 'normal',
          icon: 'refresh',
          hint: 'Fetch data from server',
          onClick: this.onRefresh.bind(this),
        },
      },
      {
        location: 'after',
        locateInMenu: 'auto',
        widget: 'dxButton',
        options: {
          type: 'danger',
          icon: 'trash',
          hint: 'Delete all items',
          onClick: this.deleteAll.bind(this),
        },
      },
      {
        location: 'after',
        locateInMenu: 'auto',
        widget: 'dxButton',
        options: {
          type: 'danger',
          icon: 'parentfolder',
          hint: 'Generate random 100+ items',
          onClick: this.onAddRandom.bind(this),
        },
      },
      {
        location: 'center',
        locateInMenu: 'auto',
        widget: 'dxTextBox',
        options: {
          valueChangeEvent: 'keyup',
          showClearButton: true,
          onKeyUp: this.onSearchKeyupHandler.bind(this),
          onValueChanged: this.onSearchValueChanged.bind(this),
          mode: 'search',
        },
      },
      {
        location: 'center',
        locateInMenu: 'auto',
        widget: 'dxButton',
        options: {
          type: 'normal',
          icon: 'filter',
          disabled: true,
          hint: 'Filter with brand',
        },
      },
      {
        location: 'center',
        locateInMenu: 'auto',
        widget: 'dxSelectBox',
        options: {
          items: this.brandList,
          valueExpr: '_id',
          searchExpr: 'name',
          displayExpr: 'name',
          searchEnabled: true,
          onValueChanged: this.onFilterChange.bind(this),
        },
      }
    );
  }

  onSearchKeyupHandler(e: any) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.isSearchingByName = true;
      this.isFilteringByCategory = false;
      console.log(this.currentSearchValue);
      this.medicineStore.initSearchByNameData(
        this.currentSearchValue,
        this.dataGrid.instance.pageIndex(),
        this.pageSize
      );
    }, 1250);
  }

  onSearchValueChanged(e: any) {
    this.currentSearchValue = e.value;
  }

  onFilterChange(e: any) {
    this.isFilteringByCategory = true;
    this.isSearchingByName = false;
    this.currentCategoryFilterValue = e.value;
    console.log(e.value);
    this.medicineStore.initFilterByCategoryData(
      e.value,
      this.dataGrid.instance.pageIndex(),
      this.pageSize
    );
  }

  checkEditorMode() {
    if (this.isFilteringByCategory === true) {
      // this.isSearchingByName = false;
      return 'FILTER';
    } else if (this.isSearchingByName === true) {
      // this.isFilteringByCategory = false;
      return 'SEARCH';
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
        default:
          break;
      }
    }
    // todo: handle virtual scrolling when pagesize = 'all'
    //
    // event of page size changed by user's click
    if (e.fullName === 'paging.pageSize') {
      this.pageSize = e.value;
      console.log(`Page size changed to ${e.value}`);
      switch (editorMode) {
        case 'NORMAL':
          this.medicineStore.loadDataAsync(
            this.currentIndexFromServer,
            e.value
          );
          this.goToPage(this.currentIndexFromServer);
          break;
        case 'FILTER':
          this.medicineStore.filterMedicineByCategory(
            this.currentCategoryFilterValue,
            this.currentIndexFromServer,
            e.value
          );
          this.goToPage(this.currentIndexFromServer);
          break;
        case 'SEARCH':
          this.medicineStore.searchMedicineByName(
            this.currentSearchValue,
            this.currentIndexFromServer,
            e.value
          );
          this.goToPage(this.currentIndexFromServer);
          break;
        default:
          break;
      }
    }
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
        this.currentSearchValue,
        index,
        this.pageSize
      );
      this.medicineStore.searchMedicineByName(
        this.currentSearchValue,
        index + 1,
        this.pageSize
      );
    } else {
      this.medicineStore.searchMedicineByName(
        this.currentSearchValue,
        index,
        this.pageSize
      );
      this.medicineStore.searchMedicineByName(
        this.currentSearchValue,
        index + 1,
        this.pageSize
      );
      this.medicineStore.searchMedicineByName(
        this.currentSearchValue,
        index - 1,
        this.pageSize
      );
    }
  }

  onEditingStart() {
    this.store.showNotif('Edit mode on', 'custom');
  }

  onInitNewRow() {
    this.store.showNotif(
      'Blank row added, please fill in information',
      'custom'
    );
  }

  onSaved(e: any) {
    if (e.changes.length) {
      switch (e.changes[0].type) {
        case 'insert':
          this.medicineStore.uploadMedicine(
            e.changes[0].data,
            this.dataGrid.instance.pageIndex(),
            this.pageSize
          );
          break;
        case 'update':
          console.log(e.changes[0]);
          this.medicineStore.updateMedicine(
            e.changes[0].data,
            e.changes[0].key,
            this.dataGrid.instance.pageIndex(),
            this.pageSize
          );
          break;
        case 'remove':
          this.medicineStore.deleteMedicine(
            e.changes[0].key,
            this.dataGrid.instance.pageIndex(),
            this.pageSize
          );
          break;
        default:
          break;
      }
    } else {
      this.store.showNotif('No changes dectected', 'custom');
    }
  }

  onEditCanceled() {
    this.store.showNotif('Editing cancelled', 'custom');
  }

  selectionChangedHandler() {
    if (this.selectedRows.length) {
      this.isSelectInfoVisible = true;
      this.selectInfoText = `${this.selectedRows.length} rows selected`;
      this.selectedRows.forEach((row) => {
        console.log(row);
      });
    } else {
      this.isSelectInfoVisible = false;
    }
  }

  changePageSize(pageSize: number) {
    this.dataGrid.instance.pageSize(pageSize);
  }

  goToPage(page: number) {
    this.dataGrid.instance.pageIndex(page);
  }

  deleteSelectedItems() {
    this.store.setIsLoading(true);
    if (this.selectedRows.length) {
      this.medicineStore.confirmDialog().then((result: boolean) => {
        if (result) {
          this.medicineHTTP
            .deleteSelectedMedicines(this.selectedRows)
            .toPromise()
            .then(() => {
              this.store.showNotif(
                `${this.selectedRows.length} items deleted`,
                'custom'
              );
              this.clearSelection();
              if (this.isFilteringByCategory === true) {
                this.medicineStore.initFilterByCategoryData(
                  this.currentCategoryFilterValue,
                  this.dataGrid.instance.pageIndex(),
                  this.pageSize
                );
              } else {
                this.medicineStore.initData(
                  this.dataGrid.instance.pageIndex(),
                  this.pageSize
                );
              }
              this.isSelectInfoVisible = false;
            })
            .then(() => {
              this.store.setIsLoading(false);
            });
        }
      });
    }
  }

  clearSelection() {
    this.selectedRows = [];
  }

  onRefresh() {
    this.isFilteringByCategory = false;
    this.isSearchingByName = false;
    this.medicineStore.initData(
      this.dataGrid.instance.pageIndex(),
      this.pageSize
    );
  }

  onAddRandom() {
    this.medicineStore.confirmDialog().then((result: boolean) => {
      if (result) {
        this.isFilteringByCategory = false;
        this.store.setIsLoading(true);
        this.medicineHTTP
          .generateRandomMedicine()
          .toPromise()
          .then(() => {
            this.medicineStore.initData(
              this.dataGrid.instance.pageIndex(),
              this.pageSize
            );
          })
          .then(() => {
            this.store.setIsLoading(false);
            this.store.showNotif('Generated 100+ random items', 'custom');
          });
      }
    });
  }

  deleteAll() {
    this.medicineStore.deleteAllMedicines();
  }

  navigateToEditDisease() {
    this.router.navigate(['/edit_disease_list']);
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
