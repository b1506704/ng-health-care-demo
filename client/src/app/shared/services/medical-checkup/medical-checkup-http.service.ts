import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalCheckup } from '../../models/medical-checkup';

@Injectable({
  providedIn: 'root',
})
export class MedicalCheckupHttpService {
  constructor(private http: HttpClient) {}
  apiMedicalCheckupUrl =
    'https://ng-health-care-demo.herokuapp.com/medicalCheckups';
  // apiMedicalCheckupUrl = 'http://localhost/medicalCheckups';

  fetchPendingMedicalCheckup(
    page: number,
    size: number
  ): Observable<MedicalCheckup> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/pending',
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  searchPendingMedicalCheckupByName(
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
      this.apiMedicalCheckupUrl + '/pending/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchPendingMedicalCheckupByCustomerID(
    page: number,
    size: number,
    customerID: string
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('customerID', customerID);
    console.log(params.toString());
    return this.http.get<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/pendingByCustomerID',
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  searchPendingMedicalCheckupByNameByCustomerID(
    value: string,
    page: number,
    size: number,
    customerID: string
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size)
      .set('customerID', customerID);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/pending/searchByNameAndCustomerID',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchCompleteMedicalCheckup(
    page: number,
    size: number
  ): Observable<MedicalCheckup> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/complete',
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  searchCompleteMedicalCheckupByName(
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
      this.apiMedicalCheckupUrl + '/complete/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchCompleteMedicalCheckupByCustomerID(
    page: number,
    size: number,
    customerID: string
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('customerID', customerID);
    console.log(params.toString());
    return this.http.get<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/completeByCustomerID',
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  searchCompleteMedicalCheckupByNameByCustomerID(
    value: string,
    page: number,
    size: number,
    customerID: string
  ): Observable<MedicalCheckup> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size)
      .set('customerID', customerID);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/complete/searchByNameAndCustomerID',
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

  getMedicalCheckupByCustomerID(
    customerID: string
  ): Observable<MedicalCheckup> {
    const params = new HttpParams().set('customerID', customerID);
    console.log(params.toString());
    return this.http.post<MedicalCheckup>(
      this.apiMedicalCheckupUrl + '/byCustomerID',
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
