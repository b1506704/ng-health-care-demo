import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { Medicine } from 'src/app/shared/models/medicine';
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
  selectedRows: string[];
  isSelectInfoVisible: Boolean;
  selectInfoText: String;
  selectedCellRow: Object;
  focusedRowKey: Number;
  pageSize: number = 5;
  autoNavigateToFocusedRow = true;

  totalPages: Number;
  totalItems: Number;
  currentPage: Number;

  constructor(
    private medicineStore: MedicineStore,
    private store: StoreService,
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
          icon: 'parentfolder',
          hint: 'Generate random 100+ items',
          onClick: this.onAddRandom.bind(this),
        },
      }
    );
  }

  onOptionChanged(e: any) {
    if (e.fullName === 'paging.pageIndex') {
      console.log('new page index is ' + e.value, this.medicineList.length);
      this.medicineStore.loadDataAsync(e.value, this.pageSize);
      this.medicineStore.loadDataAsync(e.value+1, this.pageSize);
    }
  }

  onCellClick(e: any) {
    this.selectedCellRow = e.data;
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

  onSaving(e: any) {
    let medicine: Medicine;
    // mode: single row
    // console.log(e.changes);
    if (e.changes.length) {
      switch (e.changes[0].type) {
        case 'insert':
          this.medicineStore.uploadMedicine(e.changes[0].data, 1, 5);
          break;
        case 'update':
          console.log(e.changes[0]);
          this.medicineStore.updateMedicine(
            e.changes[0].data,
            e.changes[0].key,
            1,
            5
          );
          break;
        case 'remove':
          this.medicineStore.deleteMedicine(e.changes[0].key, 1, 5);
          break;
        default:
          break;
      }
    } else {
      this.store.showNotif('No changes dectected', 'custom');
    }
    // advance: implement batch update with array of changes here
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

  onFocusedRowChanging(e: any) {
    var rowsCount = e.component.getVisibleRows().length,
      pageCount = e.component.pageCount(),
      pageIndex = e.component.pageIndex(),
      key = e.event && e.event.key;

    if (key && e.prevRowIndex === e.newRowIndex) {
      if (e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
        e.component.pageIndex(pageIndex + 1).done(function () {
          e.component.option('focusedRowIndex', 0);
        });
      } else if (e.newRowIndex === 0 && pageIndex > 0) {
        e.component.pageIndex(pageIndex - 1).done(function () {
          e.component.option('focusedRowIndex', rowsCount - 1);
        });
      }
    }
  }

  onFocusedRowChanged(e: any) {
    var rowData = e.row && e.row.data;

    if (rowData) {
      console.log(`Current row data: ${rowData}`);
      // this.taskSubject = rowData.Task_Subject;
      // this.taskDetailsHtml = this.sanitizer.bypassSecurityTrustHtml(rowData.Task_Description);
      // this.taskStatus = rowData.Task_Status;
      // this.taskProgress = rowData.Task_Completion ? `${rowData.Task_Completion}` + "%" : "";
    }
  }

  changePageSize(pageSize: number) {
    this.dataGrid.instance.pageSize(pageSize);
  }

  goToLastPage() {
    this.dataGrid.instance.pageIndex(this.dataGrid.instance.pageCount() - 1);
  }

  deleteSelectedItems() {
    if (this.selectedRows.length) {
      this.medicineStore.deleteSelectedMedicines(this.selectedRows, 1, 5);
    }
  }

  clearSelection() {
    this.selectedRows = [];
  }

  onRefresh() {
    this.medicineStore.refresh(
      this.dataGrid.instance.pageIndex() + 1,
      this.dataGrid.instance.totalCount()
    );
  }

  onAddRandom() {
    this.medicineStore.generateRandomNumber();
  }

  navigateToEditDisease() {
    this.router.navigate(['/edit_disease_list']);
  }

  sourceDataListener() {
    return this.medicineStore.$medicineList.subscribe((data: any) => {
      this.medicineList = data;
    });
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

  ngOnInit(): void {
    this.sourceDataListener();
    this.totalItemsListener();
    this.totalPagesListener();
  }

  ngOnDestroy(): void {
    this.sourceDataListener().unsubscribe();
    this.totalItemsListener().unsubscribe();
    this.totalPagesListener().unsubscribe();
  }
}
