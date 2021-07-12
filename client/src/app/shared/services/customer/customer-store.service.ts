import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../../models/customer';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { CustomerHttpService } from './customer-http.service';
import { confirm } from 'devextreme/ui/dialog';

interface CustomerState {
  customerList: Array<Customer>;
  exportData: Array<Customer>;
  selectedCustomer: Object;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: CustomerState = {
  customerList: [],
  selectedCustomer: {},
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
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
    this.initData(0, 5);
  }

  fillEmpty(
    startIndex: number,
    endIndex: number,
    sourceArray: Array<Customer>,
    addedArray: Array<Customer>
  ) {
    let result: Array<Customer> = sourceArray;
    let fillIndex = startIndex * endIndex;
    for (var j = 0; j < addedArray.length; j++) {
      result[fillIndex] = addedArray[j];
      fillIndex++;
    }
    // endIndex = pageSize
    // pageSize = 5
    // 0 => 0 ,1,2,3,4,
    // 1 -> 5,6,7,8,9
    // 2 -> 10,11,12,13,14
    // 17 -> 85,86,87,88,89
    console.log('Filled array result');
    console.log(result);
    return result;
  }

  initData(page: number, size: number) {
    this.customerService
      .fetchCustomer(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          customerList: new Array<Customer>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.customerList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.loadDataAsync(page, size);
      });
  }

  initFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.customerService
      .filterCustomerByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          customerList: new Array<Customer>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.customerList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterCustomerByCategory(value, page, size);
      });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.customerService
      .searchCustomerByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          customerList: new Array<Customer>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.customerList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchCustomerByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.customerService
      .sortCustomerByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          customerList: new Array<Customer>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.customerList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortCustomerByPrice(value, page, size);
      });
  }

  initSortByName(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.customerService
      .sortCustomerByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          customerList: new Array<Customer>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.customerList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortCustomerByName(value, page, size);
      });
  }


  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.customerService.fetchCustomer(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          customerList: this.fillEmpty(
            page,
            size,
            this.state.customerList,
            data.items
          ),
        });
        console.log('Pure list');
        console.log(this.state.customerList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  refresh(page: number, size: number) {
    this.setIsLoading(true);
    this.customerService.fetchCustomer(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          customerList: this.fillEmpty(
            page,
            size,
            this.state.customerList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.customerList);
        console.log('Server response');
        console.log(data);
        this.store.showNotif('Refresh successfully', 'custom');
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $customerList: Observable<Array<Customer>> = this.select(
    (state) => state.customerList
  );

  $exportData: Observable<Array<Customer>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedCustomer: Observable<Object> = this.select(
    (state) => state.selectedCustomer
  );

  uploadCustomer(customer: Customer, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.customerService.uploadCustomer(customer).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setTotalItems(this.state.totalItems + 1);
            console.log(data);
            this.loadDataAsync(page, size);
            this.setIsLoading(false);
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  updateCustomer(customer: Customer, key: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.customerService.updateCustomer(customer, key).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.loadDataAsync(page, size);
            this.setIsLoading(false);
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  confirmDialog(msg: string) {
    if (msg != '') {
      return confirm(`<b>${msg}</b>`, 'Confirm changes');
    }
    return confirm(`<b>Are you sure?</b>`, 'Confirm changes');
  }

  deleteSelectedCustomers(
    selectedCustomers: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.customerService
          .deleteSelectedCustomers(selectedCustomers)
          .subscribe({
            next: (data: any) => {
              this.setState({ responseMsg: data });
              console.log(data);
              this.loadDataAsync(page, size);
              console.log(this.state.customerList);
              this.setIsLoading(false);
              this.store.showNotif(data.message, 'custom');
            },
            error: (data: any) => {
              this.setIsLoading(false);
              this.store.showNotif(data.error.errorMessage, 'error');
              console.log(data);
            },
          });
      }
    });
  }

  deleteAllCustomers() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.customerService.deleteAllCustomers().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ customerList: [] });
            this.setState({ totalPages: 0 });
            this.setState({ currentPage: 0 });
            this.setState({ totalItems: 0 });
            console.log(data);
            this.setIsLoading(false);
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  deleteCustomer(id: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.customerService.deleteCustomer(id).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setTotalItems(this.state.totalItems - 1);
            console.log(data);
            this.loadDataAsync(page, size);
            this.setIsLoading(false);
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  selectCustomer(_customer: Customer) {
    this.setState({ selectedCustomer: _customer });
  }

  setTotalPages(_totalPages: number) {
    this.setState({ totalPages: _totalPages });
  }

  setTotalItems(_totalItems: number) {
    this.setState({ totalItems: _totalItems });
  }

  setCurrentPage(_currentPage: number) {
    this.setState({ currentPage: _currentPage });
  }

  getCustomer(id: string | number) {
    return this.$customerList.pipe(
      map(
        (customers: Array<Customer>) =>
          customers.find((customer) => customer._id === id)!
      )
    );
  }

  filterCustomerByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.customerService
      .filterCustomerByPrice(criteria, value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            customerList: this.fillEmpty(
              page,
              size,
              this.state.customerList,
              data.items
            ),
          });
          this.setState({ totalItems: data.totalItems });
          this.setState({ totalPages: data.totalPages });
          this.setState({ currentPage: data.currentPage });
          this.setIsLoading(false);
        },
        error: (data: any) => {
          this.setIsLoading(false);
          this.store.showNotif(data.error.errorMessage, 'error');
          console.log(data);
        },
      });
  }

  filterCustomerByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.customerService.filterCustomerByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          customerList: this.fillEmpty(
            page,
            size,
            this.state.customerList,
            data.items
          ),
        });
        console.log('Filtered list');
        console.log(this.state.customerList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  searchCustomerByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.customerService.searchCustomerByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          customerList: this.fillEmpty(
            page,
            size,
            this.state.customerList,
            data.items
          ),
        });
        console.log('Searched list');
        console.log(this.state.customerList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  sortCustomerByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.customerService.sortCustomerByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          customerList: this.fillEmpty(
            page,
            size,
            this.state.customerList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.customerList);
        console.log('Server response');
        console.log(data);
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  sortCustomerByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.customerService.sortCustomerByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          customerList: this.fillEmpty(
            page,
            size,
            this.state.customerList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.customerList);
        console.log('Server response');
        console.log(data);
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  setExportData(array: Array<Customer>) {
    this.setState({ customerList: array });
  }
}
