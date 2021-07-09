import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { Medicine } from 'src/app/shared/models/medicine';
import { MedicineHttpService } from 'src/app/shared/services/medicine/medicine-http.service';
import { MedicineStore } from 'src/app/shared/services/medicine/medicine-store.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-edit-medicine-list',
  templateUrl: './edit-medicine-list.component.html',
  styleUrls: ['./edit-medicine-list.component.scss'],
})
export class EditMedicineListComponent implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  medicineList!: Array<Medicine>;
  brandList: Array<Object> = [
    {
      _id: 0,
      name: 'Tesla',
    },
    {
      _id: 1,
      name: 'ABC',
    },
    {
      _id: 0,
      name: 'Covac',
    },
  ];
  selectedRows: string[];
  isSelectInfoVisible: boolean;
  selectInfoText: String;
  selectedCellRow: Object;
  pageSize: number = 5;
  totalPages: number;
  totalItems: number;
  currentPage: number;

  isSearchingByName: boolean;
  isFilteringByCategory: boolean;
  isFilteringByPrice: boolean;
  isSortingByName: boolean;
  isSortingByPrice: boolean;

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
        widget: 'dxSelectBox',
        options: {
          items: this.brandList,
          valueExpr: 'name',
          searchExpr: 'name',
          displayExpr: 'name',
          searchEnabled: true,
          onValueChanged: this.onFilterChange.bind(this),
        },
      },
      {
        location: 'center',
        locateInMenu: 'auto',
        widget: 'dxButton',
        options: {
          hint: 'Filter with criteria',
          disabled: true,
        },
      }
    );
  }

  onFilterChange(e: any) {
    this.medicineStore.setIsFilteringByCategory(true);
    console.log(e.value);
    setTimeout(() => {
      this.medicineStore.initFilterByCategoryData(
        e.value,
        this.dataGrid.instance.pageIndex(),
        this.dataGrid.instance.pageSize()
      );
    }, 200);
  }

  onOptionChanged(e: any) {
    if (e.fullName === 'paging.pageIndex') {
      console.log(
        `New page index: ${e.value}. Total items: ${this.medicineList.length}`
      );
      this.medicineStore.$isFilteringByCategory
        .subscribe((data: boolean) => {
          if (data === true) {
            this.medicineStore.filterMedicineByCategory(
              e.value,
              this.dataGrid.instance.pageIndex(),
              this.dataGrid.instance.pageSize()
            );
            this.dataGrid.instance.refresh();
          } else {
            if (e.value === 0) {
              this.medicineStore.loadDataAsync(
                e.value,
                this.dataGrid.instance.pageSize()
              );
              this.medicineStore.loadDataAsync(
                e.value + 1,
                this.dataGrid.instance.pageSize()
              );
            } else {
              this.medicineStore.loadDataAsync(
                e.value,
                this.dataGrid.instance.pageSize()
              );
              this.medicineStore.loadDataAsync(
                e.value + 1,
                this.dataGrid.instance.pageSize()
              );
              this.medicineStore.loadDataAsync(
                e.value - 1,
                this.dataGrid.instance.pageSize()
              );
            }
          }
        })
        .unsubscribe();
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
            this.currentPage,
            this.pageSize
          );
          break;
        case 'update':
          console.log(e.changes[0]);
          this.medicineStore.updateMedicine(
            e.changes[0].data,
            e.changes[0].key,
            this.currentPage,
            this.pageSize
          );
          break;
        case 'remove':
          this.medicineStore.deleteMedicine(
            e.changes[0].key,
            this.currentPage,
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
              this.medicineStore.initData(
                this.dataGrid.instance.pageIndex(),
                this.dataGrid.instance.pageSize()
              );
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
    this.medicineStore.setIsFilteringByCategory(false);
    this.medicineStore.refresh(
      this.dataGrid.instance.pageIndex(),
      this.pageSize
    );
  }

  onAddRandom() {
    this.medicineStore.confirmDialog().then((result: boolean) => {
      if (result) {
        this.store.setIsLoading(true);
        this.medicineHTTP
          .generateRandomMedicine()
          .toPromise()
          .then(() => {
            this.medicineStore.initData(
              this.dataGrid.instance.pageIndex(),
              this.dataGrid.instance.pageSize()
            );
          })
          .then(() => {
            this.dataGrid.instance.refresh();
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
    // this.medicineStore.$isFilteringByCategory.subscribe((data: boolean) => {
    //   if (data === true) {
    //     return this.medicineStore.$filteredMedicineList.subscribe(
    //       (data: any) => {
    //         this.medicineList = data;
    //       }
    //     );
    //   }
    // });
    // return this.medicineStore.$medicineList.subscribe((data: any) => {
    //   this.medicineList = data;
    // });
  }

  totalPagesListener() {
    return this.medicineStore.$totalPages.subscribe((data: any) => {
      this.totalPages = data;
    });
  }

  totalItemsListener() {
    return this.medicineStore.$totalItems.subscribe((data: any) => {
      this.totalItems = data;
    });
  }

  currentPageListener() {
    return this.medicineStore.$currentPage.subscribe((data: any) => {
      this.currentPage = data;
    });
  }

  searchByNameListener() {
    return this.medicineStore.$isSearchingByName.subscribe((data: any) => {
      this.isSearchingByName = data;
    });
  }

  filterByPriceListener() {
    return this.medicineStore.$currentPage.subscribe((data: any) => {
      this.isFilteringByPrice = data;
    });
  }

  filterByCategoryListener() {
    return this.medicineStore.$currentPage.subscribe((data: any) => {
      this.isFilteringByCategory = data;
    });
  }

  sortByNameListener() {
    return this.medicineStore.$currentPage.subscribe((data: any) => {
      this.isSortingByName = data;
    });
  }

  sortByPriceListener() {
    return this.medicineStore.$currentPage.subscribe((data: any) => {
      this.isSortingByPrice = data;
    });
  }

  ngOnInit(): void {
    // this.sourceDataListener();
    this.medicineStore.$isFilteringByCategory.subscribe((data: boolean) => {
      if (data === true) {
        this.medicineStore.$filteredMedicineList.subscribe((data: any) => {
          this.medicineList = data;
          console.log('Filter mode');
        });
      } else {
        this.medicineStore.$medicineList.subscribe((data: any) => {
          this.medicineList = data;
          console.log('Normal mode');
        });
      }
    });
    this.totalItemsListener();
    this.totalPagesListener();
    // this.sortByNameListener();
    // this.sortByPriceListener();
    // this.searchByNameListener();
    // this.filterByCategoryListener();
    // this.filterByPriceListener();
  }

  ngOnDestroy(): void {
    // this.sourceDataListener().unsubscribe();
    this.totalItemsListener().unsubscribe();
    this.totalPagesListener().unsubscribe();
    // this.sortByNameListener().unsubscribe();
    // this.sortByPriceListener().unsubscribe();
    // this.searchByNameListener().unsubscribe();
    // this.filterByCategoryListener().unsubscribe();
    // this.filterByPriceListener().unsubscribe();
  }
}
