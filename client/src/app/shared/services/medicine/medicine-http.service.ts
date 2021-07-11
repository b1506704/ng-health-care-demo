import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medicine } from '../../models/medicine';

@Injectable({
  providedIn: 'root',
})
export class MedicineHttpService {
  constructor(private http: HttpClient) {}
  apiMedicineUrl = 'https://ng-health-care-demo.herokuapp.com/medicines';
  // apiMedicineUrl = 'http://localhost/medicines';

  fetchMedicine(page: number, size: number): Observable<Medicine> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<Medicine>(this.apiMedicineUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  searchMedicineByName(
    value: string,
    page: number,
    size: number
  ): Observable<Medicine> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Medicine>(
      this.apiMedicineUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterMedicineByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<Medicine> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Medicine>(
      this.apiMedicineUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterMedicineByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<Medicine> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Medicine>(
      this.apiMedicineUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortMedicineByName(
    value: string,
    page: number,
    size: number
  ): Observable<Medicine> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Medicine>(
      this.apiMedicineUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortMedicineByPrice(
    value: string,
    page: number,
    size: number
  ): Observable<Medicine> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Medicine>(
      this.apiMedicineUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiMedicineUrl, medicine, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomMedicine(): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiMedicineUrl + '/randomMedicine', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteAllMedicines(): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiMedicineUrl + '/deleteAll', {
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

  getMedicine(id: string): Observable<Medicine> {
    return this.http.get<Medicine>(this.apiMedicineUrl + `/${id}`, {
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

  fetchAll(): Observable<Medicine> {
    return this.http.post<Medicine>(
      this.apiMedicineUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
