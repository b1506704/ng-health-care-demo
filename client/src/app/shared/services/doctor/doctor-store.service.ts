import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Doctor } from '../../models/doctor';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { DoctorHttpService } from './doctor-http.service';

interface DoctorState {
  doctorList: Array<Doctor>;
  filteredDoctorList: Array<Doctor>;
  searchedDoctorList: Array<Doctor>;
  selectedDoctor: Object;
  responseMsg: String;
}
const initialState: DoctorState = {
  doctorList: [],
  filteredDoctorList: [],
  searchedDoctorList: [],
  selectedDoctor: {},
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class DoctorStore extends StateService<DoctorState> {
  constructor(
    private doctorService: DoctorHttpService,
    private store: StoreService
  ) {
    super(initialState);
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.doctorService.fetchDoctor().subscribe({
      next: (data: any) => {
        this.setState({ doctorList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotif('Load doctor successfully', 'custom');
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $doctorList: Observable<Array<Doctor>> = this.select(
    (state) => state.doctorList
  );

  $filteredDoctorList: Observable<Array<Doctor>> = this.select(
    (state) => state.filteredDoctorList
  );

  $searchedDoctorList: Observable<Array<Doctor>> = this.select(
    (state) => state.searchedDoctorList
  );

  $selectedDoctor: Observable<Object> = this.select(
    (state) => state.selectedDoctor
  );

  uploadDoctor(doctor: Doctor) {
    this.setIsLoading(true);
    this.doctorService.uploadDoctor(doctor).subscribe({
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

  updateDoctor(doctor: Doctor) {
    this.setIsLoading(true);
    this.doctorService.updateDoctor(doctor).subscribe({
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

  deleteDoctor(doctor: Doctor) {
    this.setIsLoading(true);
    this.doctorService.deleteDoctor(doctor).subscribe({
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

  selectDoctor(_doctor: Doctor) {
    this.setState({ selectedDoctor: _doctor });
  }

  getDoctor(id: string | number) {
    return this.$doctorList.pipe(
      map(
        (doctors: Array<Doctor>) => doctors.find((doctor) => doctor.id === id)!
      )
    );
  }

  filterDoctor(_doctorList: Array<Doctor>, _criteria: string) {
    this.setState({ filteredDoctorList: _doctorList });
  }

  searchDoctor(_doctorList: Array<Doctor>, _criteria: string) {
    this.setState({ searchedDoctorList: _doctorList });
  }
}
