import { Injectable, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bill } from '../models/bill';
import { Customer } from '../models/customer';
import { Doctor } from '../models/doctor';
import { Medicine } from '../models/medicine';
import { Prescription } from '../models/prescription';
import { Schedule } from '../models/schedule';
import { BillHttpService } from './bill-http.service';
import { CustomerHttpService } from './customer-http.service';
import { DiseaseHTTPService } from './disease-http.service';
import { DoctorHttpService } from './doctor-http.service';
import { MedicineHttpService } from './medicine-http.service';
import { NotificationService } from './notification.service';
import { PrescriptionHttpService } from './prescription-http.service';
import { ScheduleHttpService } from './schedule-http.service';
import { StateService } from './state.service';

interface StoreState {
  // customer
  customerList: Array<Customer>;
  filteredCustomerList: Array<Customer>;
  searchedCustomerList: Array<Customer>;
  selectedCustomer: Object;
  // doctor
  doctorList: Array<Doctor>;
  filteredDoctorList: Array<Doctor>;
  searchedDoctorList: Array<Doctor>;
  selectedDoctor: Object;
  // bill
  billList: Array<Bill>;
  filteredBillList: Array<Bill>;
  searchedBillList: Array<Bill>;
  selectedBill: Object;
  // prescription
  prescriptionList: Array<Prescription>;
  filteredPrescriptionList: Array<Prescription>;
  searchedPrescriptionList: Array<Prescription>;
  selectedPrescription: Object;
  // schedule
  scheduleList: Array<Schedule>;
  filteredScheduleList: Array<Schedule>;
  searchedScheduleList: Array<Schedule>;
  selectedSchedule: Object;
  // medicine
  medicineList: Array<Medicine>;
  filteredMedicineList: Array<Medicine>;
  searchedMedicineList: Array<Medicine>;
  selectedMedicine: Object;
  // current logged in user
  currentUser: Object;
  // response message
  responseMsg: String;
  //flag
  isLoading: Boolean;
  isFiltering: Boolean;
  isSearching: Boolean;
  lastVisitTime: Date;
  toggleUpdateForm?: TemplateRef<any>;
}
const initialState: StoreState = {
  // customer
  customerList: [],
  filteredCustomerList: [],
  searchedCustomerList: [],
  selectedCustomer: {},
  // doctor
  doctorList: [],
  filteredDoctorList: [],
  searchedDoctorList: [],
  selectedDoctor: {},
  // bill
  billList: [],
  filteredBillList: [],
  searchedBillList: [],
  selectedBill: {},
  // prescription
  prescriptionList: [],
  filteredPrescriptionList: [],
  searchedPrescriptionList: [],
  selectedPrescription: {},
  // schedule
  scheduleList: [],
  filteredScheduleList: [],
  searchedScheduleList: [],
  selectedSchedule: {},
  // medicine
  medicineList: [],
  filteredMedicineList: [],
  searchedMedicineList: [],
  selectedMedicine: {},
  // current logged in user
  currentUser: {},
  // response message
  responseMsg: '',
  // flag variables
  isLoading: false,
  isFiltering: false,
  isSearching: false,
  lastVisitTime: new Date(),
  toggleUpdateForm: undefined,
};
@Injectable({
  providedIn: 'root',
})
export class StoreService extends StateService<StoreState> {
  constructor(
    private notifService: NotificationService,
    private customerService: CustomerHttpService,
    private billService: BillHttpService,
    private doctorService: DoctorHttpService,
    private medicineService: MedicineHttpService,
    private scheduleService: ScheduleHttpService,
    private diseaseService: DiseaseHTTPService,
    private prescriptionService: PrescriptionHttpService
  ) {
    super(initialState);
    // this.loadDataAsync();
  }
  // general obs & functions
  $state: Observable<StoreState> = this.select((state) => state);

  $isLoading: Observable<Boolean> = this.select((state) => state.isLoading);

  $isFiltering: Observable<Boolean> = this.select((state) => state.isFiltering);

  $isSearching: Observable<Boolean> = this.select((state) => state.isSearching);

  $modalRef: Observable<any> = this.select((state) => state.toggleUpdateForm);

  loadDataAsync() {
    //   this.setIsLoading(true);
    //   const fetchCustomer = this.apiService.fetchCustomer().subscribe({
    //     next: (data: any) => {
    //       this.setState({ CustomerList: data });
    //       console.log(data);
    //     },
    //     complete: () => {
    //       if (this.checkIsLoading() === true && fetchHouse.closed === true) {
    //         this.setIsLoading(false);
    //         this.showNotifSuccess('Load data successfully!');
    //       }
    //     },
    //   });
    //   const fetchHouse = this.apiService.fetchHouse().subscribe({
    //     next: (data: any) => {
    //       this.setState({ houseList: data });
    //       console.log(data);
    //     },
    //     complete: () => {
    //       if (this.checkIsLoading() === true && fetchCustomer.closed === true) {
    //         this.setIsLoading(false);
    //         this.showNotifSuccess('Load data successfully!');
    //       }
    //     },
    //   });
  }

  setIsLoading(_isLoading: Boolean) {
    this.setState({ isLoading: _isLoading });
  }

  setIsFiltering(_isFiltering: Boolean) {
    this.setState({ isFiltering: _isFiltering });
    this.showNotifSuccess(_isFiltering === true ? 'FILTER: ON' : 'FILTER: OFF');
  }

  setIsSearching(_isSearching: Boolean) {
    this.setState({ ...this.state, isSearching: _isSearching });
  }

  checkIsLoading(): Boolean {
    let isLoading = false;
    this.$isLoading.subscribe((data: any) => (isLoading = data));
    return isLoading;
  }

  triggerModal(content: TemplateRef<any>) {
    this.setState({ toggleUpdateForm: content });
    // console.log(content);
  }

  setLastVisit(_date: Date) {
    this.setState({ lastVisitTime: _date });
  }

  showNotifSuccess(msg: any) {
    this.notifService.showNotif(msg, {
      delay: 3500,
    });
  }

  showNotifError(msg: any) {
    this.notifService.showNotif(msg, {
      classname: 'bg-danger text-light shadow-lg',
      delay: 3500,
    });
  }

  showNotifWithTemplate(templateRef: any) {
    this.notifService.showNotif(templateRef, {
      classname: 'bg-danger text-light shadow-lg',
      delay: 3500,
    });
  }

  // customer obs & functions

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
        if (this.checkIsLoading() === true) {
          this.setIsLoading(false);
          this.loadDataAsync();
          this.showNotifSuccess(`Customer: ${customer.id} uploaded!`);
        }
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
        if (this.checkIsLoading() === true) {
          this.setIsLoading(false);
          this.loadDataAsync();
          this.showNotifSuccess(`Customer: ${customer.id} updated!`);
        }
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
        if (this.checkIsLoading() === true) {
          this.setIsLoading(false);
          this.loadDataAsync();
          this.showNotifSuccess(`Customer: ${customer.id} deleted!`);
        }
      },
    });
  }

  selectCustomer(_customer: Customer) {
    this.setState({ selectedCustomer: _customer });
  }

  getCustomer(id: string | number) {
    return this.$customerList.pipe(
      map(
        (customers: Array<Customer>) =>
          customers.find((customer) => customer.id === id)!
      )
    );
  }

  filterCustomer(_customerList: Array<Customer>, _criteria: string) {
    this.setState({ filteredCustomerList: _customerList });
    this.showNotifSuccess(`Filter with ${_criteria}`);
  }

  searchCustomer(_customerList: Array<Customer>, _criteria: string) {
    this.setState({ searchedCustomerList: _customerList });
  }
}
