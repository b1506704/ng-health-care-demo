import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalCheckup } from '../../models/medical-checkup';

@Injectable({
  providedIn: 'root',
})
export class MedicalCheckupHttpService {
  constructor(private http: HttpClient) {}
  apiMedicalCheckupUrl = 'https://ng-health-care-demo.herokuapp.com/medicalCheckups';
  // apiMedicalCheckupUrl = 'http://localhost/medicalCheckups';

  fetchMedicalCheckup(page: number, size: number): Observable<MedicalCheckup> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<MedicalCheckup>(this.apiMedicalCheckupUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  searchMedicalCheckupByName(
    value: string,
    page: number,
    size: number
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterMedicalCheckupByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterMedicalCheckupByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterMedicalCheckupByJob(
    value: string,
    page: number,
    size: number
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/filterByJob',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterMedicalCheckupByGender(
    value: string,
    page: number,
    size: number
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/filterByGender',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortMedicalCheckupByName(
    value: string,
    page: number,
    size: number
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortMedicalCheckupByPrice(
    value: string,
    page: number,
    size: number
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadMedicalCheckup(
    medicalCheckup: MedicalCheckup
  ): Observable<MedicalCheckup> {
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl,
      medicalCheckup,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  generateRandomMedicalCheckup(): Observable<MedicalCheckup> {
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/randomMedicalCheckup',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteAllMedicalCheckups(): Observable<MedicalCheckup> {
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/deleteAll',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteMedicalCheckup(id: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiMedicalCheckupUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getMedicalCheckup(id: string): Observable<MedicalCheckup> {
    return this.http.get<MedicalCheckup>(this.apiMedicalCheckupUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getMedicalCheckupByUserName(userName: string): Observable<MedicalCheckup> {
    const params = new HttpParams().set('userName', userName);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/byUserName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteSelectedMedicalCheckups(
    selectedItems: Array<String>
  ): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiMedicalCheckupUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateMedicalCheckup(
    medicalCheckup: MedicalCheckup,
    key: string
  ): Observable<MedicalCheckup> {
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + `/updateMedicalCheckup/${key}`,
      medicalCheckup,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchAll(): Observable<MedicalCheckup> {
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
