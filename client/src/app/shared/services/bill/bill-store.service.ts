import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bill } from '../../models/bill';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { BillHttpService } from './bill-http.service';

interface BillState {
  billList: Array<Bill>;
  filteredBillList: Array<Bill>;
  searchedBillList: Array<Bill>;
  selectedBill: Object;
  responseMsg: String;
}
const initialState: BillState = {
  billList: [],
  filteredBillList: [],
  searchedBillList: [],
  selectedBill: {},
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class BillStore extends StateService<BillState> {
  constructor(
    private billService: BillHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.billService.fetchBill().subscribe({
      next: (data: any) => {
        this.setState({ billList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotif('Load bill successfully', 'custom');
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $billList: Observable<Array<Bill>> = this.select((state) => state.billList);

  $filteredBillList: Observable<Array<Bill>> = this.select(
    (state) => state.filteredBillList
  );

  $searchedBillList: Observable<Array<Bill>> = this.select(
    (state) => state.searchedBillList
  );

  $selectedBill: Observable<Object> = this.select(
    (state) => state.selectedBill
  );

  uploadBill(bill: Bill) {
    this.setIsLoading(true);
    this.billService.uploadBill(bill).subscribe({
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

  updateBill(bill: Bill) {
    this.setIsLoading(true);
    this.billService.updateBill(bill).subscribe({
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

  deleteBill(bill: Bill) {
    this.setIsLoading(true);
    this.billService.deleteBill(bill).subscribe({
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

  selectBill(_bill: Bill) {
    this.setState({ selectedBill: _bill });
  }

  getBill(id: string | number) {
    return this.$billList.pipe(
      map((bills: Array<Bill>) => bills.find((bill) => bill.id === id)!)
    );
  }

  filterBill(_billList: Array<Bill>, _criteria: string) {
    this.setState({ filteredBillList: _billList });
  }

  searchBill(_billList: Array<Bill>, _criteria: string) {
    this.setState({ searchedBillList: _billList });
  }
}
