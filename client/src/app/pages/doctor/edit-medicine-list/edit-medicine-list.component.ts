import { Component, OnInit, ViewChild } from '@angular/core';
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
export class EditMedicineListComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  medicineList!: Array<Medicine>;
  selectedRows: string[];
  isSelectInfoVisible: Boolean;
  selectInfoText: String;
  selectedCellRow: Object;
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
          this.medicineStore.uploadMedicine(e.changes[0].data);
          break;
        case 'update':
          console.log(e.changes[0]);
          this.medicineStore.updateMedicine(
            e.changes[0].data,
            e.changes[0].key
          );
          break;
        case 'remove':
          this.medicineStore.deleteMedicine(e.changes[0].key);
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

  deleteSelectedItems() {
    if (this.selectedRows.length) {
      this.medicineStore.deleteSelectedMedicines(this.selectedRows);
    }
  }

  clearSelection() {
    this.selectedRows = [];
  }

  onRefresh() {
    this.medicineStore.refresh();
  }

  onAddRandom() {
    this.medicineStore.generateRandomNumber();
  }

  navigateToEditDisease() {
    this.router.navigate(['/edit_disease_list']);
  }

  ngOnInit(): void {
    this.medicineStore.$medicineList.subscribe((data: any) => {
      this.medicineList = data;
    });
  }
}
