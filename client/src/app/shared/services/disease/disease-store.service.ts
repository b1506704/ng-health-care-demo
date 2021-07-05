import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Disease } from '../../models/disease';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { DiseaseHTTPService } from './disease-http.service';

interface DiseaseState {
  diseaseList: Array<Disease>;
  filteredDiseaseList: Array<Disease>;
  searchedDiseaseList: Array<Disease>;
  selectedDisease: Object;
  responseMsg: String;
}
const initialState: DiseaseState = {
  diseaseList: [],
  filteredDiseaseList: [],
  searchedDiseaseList: [],
  selectedDisease: {},
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class DiseaseStore extends StateService<DiseaseState> {
  constructor(
    private diseaseService: DiseaseHTTPService,
    private store: StoreService
  ) {
    super(initialState);
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.diseaseService.fetchDisease().subscribe({
      next: (data: any) => {
        this.setState({ diseaseList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.store.showNotifSuccess('Load disease successfully', 'custom');
      },
    });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $diseaseList: Observable<Array<Disease>> = this.select(
    (state) => state.diseaseList
  );

  $filteredDiseaseList: Observable<Array<Disease>> = this.select(
    (state) => state.filteredDiseaseList
  );

  $searchedDiseaseList: Observable<Array<Disease>> = this.select(
    (state) => state.searchedDiseaseList
  );

  $selectedDisease: Observable<Object> = this.select(
    (state) => state.selectedDisease
  );

  uploadDisease(disease: Disease) {
    this.setIsLoading(true);
    this.diseaseService.uploadDisease(disease).subscribe({
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

  updateDisease(disease: Disease) {
    this.setIsLoading(true);
    this.diseaseService.updateDisease(disease).subscribe({
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

  deleteDisease(disease: Disease) {
    this.setIsLoading(true);
    this.diseaseService.deleteDisease(disease).subscribe({
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

  selectDisease(_disease: Disease) {
    this.setState({ selectedDisease: _disease });
  }

  getDisease(id: string | number) {
    return this.$diseaseList.pipe(
      map(
        (diseases: Array<Disease>) =>
          diseases.find((disease) => disease.id === id)!
      )
    );
  }

  filterDisease(_diseaseList: Array<Disease>, _criteria: string) {
    this.setState({ filteredDiseaseList: _diseaseList });
  }

  searchDisease(_diseaseList: Array<Disease>, _criteria: string) {
    this.setState({ searchedDiseaseList: _diseaseList });
  }
}
