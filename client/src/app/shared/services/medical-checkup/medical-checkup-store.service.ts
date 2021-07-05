import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedicalCheckup } from '../../models/medical-checkup';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { MedicalCheckupHttpService } from './medical-checkup-http.service';

interface MedicalCheckupState {
  medicalCheckupList: Array<MedicalCheckup>;
  filteredMedicalCheckupList: Array<MedicalCheckup>;
  searchedMedicalCheckupList: Array<MedicalCheckup>;
  selectedMedicalCheckup: Object;
  responseMsg: String;
}
const initialState: MedicalCheckupState = {
  medicalCheckupList: [],
  filteredMedicalCheckupList: [],
  searchedMedicalCheckupList: [],
  selectedMedicalCheckup: {},
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class MedicalCheckupStore extends StateService<MedicalCheckupState> {
  constructor(
    private medicalCheckupService: MedicalCheckupHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.medicalCheckupService.fetchMedicalCheckup().subscribe({
      next: (data: any) => {
        this.setState({ medicalCheckupList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotifSuccess(
          'Load medicalCheckup successfully',
          'custom'
        );
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $medicalCheckupList: Observable<Array<MedicalCheckup>> = this.select(
    (state) => state.medicalCheckupList
  );

  $filteredMedicalCheckupList: Observable<Array<MedicalCheckup>> = this.select(
    (state) => state.filteredMedicalCheckupList
  );

  $searchedMedicalCheckupList: Observable<Array<MedicalCheckup>> = this.select(
    (state) => state.searchedMedicalCheckupList
  );

  $selectedMedicalCheckup: Observable<Object> = this.select(
    (state) => state.selectedMedicalCheckup
  );

  uploadMedicalCheckup(medicalCheckup: MedicalCheckup) {
    this.setIsLoading(true);
    this.medicalCheckupService.uploadMedicalCheckup(medicalCheckup).subscribe({
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

  updateMedicalCheckup(medicalCheckup: MedicalCheckup) {
    this.setIsLoading(true);
    this.medicalCheckupService.updateMedicalCheckup(medicalCheckup).subscribe({
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

  deleteMedicalCheckup(medicalCheckup: MedicalCheckup) {
    this.setIsLoading(true);
    this.medicalCheckupService.deleteMedicalCheckup(medicalCheckup).subscribe({
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

  selectMedicalCheckup(_medicalCheckup: MedicalCheckup) {
    this.setState({ selectedMedicalCheckup: _medicalCheckup });
  }

  getMedicalCheckup(id: string | number) {
    return this.$medicalCheckupList.pipe(
      map(
        (medicalCheckups: Array<MedicalCheckup>) =>
          medicalCheckups.find((medicalCheckup) => medicalCheckup.id === id)!
      )
    );
  }

  filterMedicalCheckup(
    _medicalCheckupList: Array<MedicalCheckup>,
    _criteria: string
  ) {
    this.setState({ filteredMedicalCheckupList: _medicalCheckupList });
  }

  searchMedicalCheckup(
    _medicalCheckupList: Array<MedicalCheckup>,
    _criteria: string
  ) {
    this.setState({ searchedMedicalCheckupList: _medicalCheckupList });
  }
}
