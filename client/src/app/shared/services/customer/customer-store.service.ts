import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../../models/customer';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { CustomerHttpService } from './customer-http.service';

interface CustomerState {
  customerList: Array<Customer>;
  filteredCustomerList: Array<Customer>;
  searchedCustomerList: Array<Customer>;
  selectedCustomer: Object;
  responseMsg: String;
}
const initialState: CustomerState = {
  customerList: [],
  filteredCustomerList: [],
  searchedCustomerList: [],
  selectedCustomer: {},
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class CustomerStore extends StateService<CustomerState> {
  constructor(
    private customerService: CustomerHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.customerService.fetchCustomer().subscribe({
      next: (data: any) => {
        this.setState({ customerList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotifSuccess('Load customer successfully', 'custom');
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $customerList: Observable<Array<Customer>> = this.select(
    (state) => state.customerList
  );

  $filteredCustomerList: Observable<Array<Customer>> = this.select(
    (state) => state.filteredCustomerList
  );

  $searchedCustomerList: Observable<Array<Customer>> = this.select(
    (state) => state.searchedCustomerList
  );

  $selectedCustomer: Observable<Object> = this.select(
    (state) => state.selectedCustomer
  );

  uploadCustomer(customer: Customer) {
    this.setIsLoading(true);
    this.customerService.uploadCustomer(customer).subscribe({
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

  updateCustomer(customer: Customer) {
    this.setIsLoading(true);
    this.customerService.updateCustomer(customer).subscribe({
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

  deleteCustomer(customer: Customer) {
    this.setIsLoading(true);
    this.customerService.deleteCustomer(customer).subscribe({
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

  selectCustomer(_customer: Customer) {
    this.setState({ selectedCustomer: _customer });
  }

  getCustomer(userName: string | number) {
    return this.$customerList.pipe(
      map(
        (customers: Array<Customer>) =>
          customers.find((customer) => customer.userName === userName)!
      )
    );
  }

  filterCustomer(_customerList: Array<Customer>, _criteria: string) {
    this.setState({ filteredCustomerList: _customerList });
  }

  searchCustomer(_customerList: Array<Customer>, _criteria: string) {
    this.setState({ searchedCustomerList: _customerList });
  }
}
