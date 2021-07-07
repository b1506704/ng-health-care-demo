import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Medicine } from '../../models/medicine';

@Injectable({
  providedIn: 'root',
})
export class MedicineHttpService {
  constructor(private http: HttpClient) {}
  apiMedicineUrl = 'https://ng-health-care-demo.herokuapp.com/medicines';
  // apiMedicineUrl = 'http://localhost/medicines';

  fetchMedicine(): Observable<Medicine> {
    return this.http.get<Medicine>(this.apiMedicineUrl, {
      reportProgress: true,
      observe: 'body',
    });
  }

  uploadMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiMedicineUrl, medicine, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomMedicine(): Observable<Medicine> {
    return this.http.get<Medicine>(this.apiMedicineUrl + '/randomMedicine', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteMedicine(id: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiMedicineUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteSelectedMedicines(
    selectedItems: Array<String>
  ): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiMedicineUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateMedicine(medicine: Medicine, key: string): Observable<Medicine> {
    return this.http.post<Medicine>(
      this.apiMedicineUrl + `/updateMedicine/${key}`,
      medicine,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
