import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prescription } from '../../models/prescription';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { PrescriptionHttpService } from './prescription-http.service';

interface PrescriptionState {
  prescriptionList: Array<Prescription>;
  filteredPrescriptionList: Array<Prescription>;
  searchedPrescriptionList: Array<Prescription>;
  selectedPrescription: Object;
  responseMsg: String;
}
const initialState: PrescriptionState = {
  prescriptionList: [],
  filteredPrescriptionList: [],
  searchedPrescriptionList: [],
  selectedPrescription: {},
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class PrescriptionStore extends StateService<PrescriptionState> {
  constructor(
    private prescriptionService: PrescriptionHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.prescriptionService.fetchPrescription().subscribe({
      next: (data: any) => {
        this.setState({ prescriptionList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotif('Load prescription successfully', 'custom');
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $prescriptionList: Observable<Array<Prescription>> = this.select(
    (state) => state.prescriptionList
  );

  $filteredPrescriptionList: Observable<Array<Prescription>> = this.select(
    (state) => state.filteredPrescriptionList
  );

  $searchedPrescriptionList: Observable<Array<Prescription>> = this.select(
    (state) => state.searchedPrescriptionList
  );

  $selectedPrescription: Observable<Object> = this.select(
    (state) => state.selectedPrescription
  );

  uploadPrescription(prescription: Prescription) {
    this.setIsLoading(true);
    this.prescriptionService.uploadPrescription(prescription).subscribe({
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

  updatePrescription(prescription: Prescription) {
    this.setIsLoading(true);
    this.prescriptionService.updatePrescription(prescription).subscribe({
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

  deletePrescription(prescription: Prescription) {
    this.setIsLoading(true);
    this.prescriptionService.deletePrescription(prescription).subscribe({
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

  selectPrescription(_prescription: Prescription) {
    this.setState({ selectedPrescription: _prescription });
  }

  getPrescription(id: string | number) {
    return this.$prescriptionList.pipe(
      map(
        (prescriptions: Array<Prescription>) =>
          prescriptions.find((prescription) => prescription.id === id)!
      )
    );
  }

  filterPrescription(
    _prescriptionList: Array<Prescription>,
    _criteria: string
  ) {
    this.setState({ filteredPrescriptionList: _prescriptionList });
  }

  searchPrescription(
    _prescriptionList: Array<Prescription>,
    _criteria: string
  ) {
    this.setState({ searchedPrescriptionList: _prescriptionList });
  }
}
