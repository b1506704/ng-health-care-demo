import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prescription } from '../../models/prescription';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionHttpService {
  constructor(private http: HttpClient) {}
  apiPrescriptionUrl = 'https://ng-health-care-demo.herokuapp.com/prescriptions';
  // apiPrescriptionUrl = 'http://localhost/prescriptions';

  fetchPrescription(page: number, size: number): Observable<Prescription> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<Prescription>(this.apiPrescriptionUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  fetchPrescriptionByCustomerID(
    page: number,
    size: number,
    customerID: string
  ): Observable<Prescription> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('customerID', customerID);
    console.log(params.toString());
    return this.http.get<Prescription>(
      this.apiPrescriptionUrl + '/byCustomerID',
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  searchPrescriptionByName(
    value: string,
    page: number,
    size: number
  ): Observable<Prescription> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Prescription>(
      this.apiPrescriptionUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterPrescriptionByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<Prescription> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Prescription>(
      this.apiPrescriptionUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterPrescriptionByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<Prescription> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Prescription>(
      this.apiPrescriptionUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortPrescriptionByName(
    value: string,
    page: number,
    size: number
  ): Observable<Prescription> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Prescription>(
      this.apiPrescriptionUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortPrescriptionByPrice(
    value: string,
    page: number,
    size: number
  ): Observable<Prescription> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Prescription>(
      this.apiPrescriptionUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadPrescription(prescription: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiPrescriptionUrl, prescription, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomPrescription(): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiPrescriptionUrl + '/randomPrescription', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteAllPrescriptions(): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiPrescriptionUrl + '/deleteAll', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deletePrescription(id: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiPrescriptionUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getPrescription(id: string): Observable<Prescription> {
    return this.http.get<Prescription>(this.apiPrescriptionUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getPrescriptionByMedicalCheckupID(medicalCheckupID: string): Observable<Prescription> {
    const params = new HttpParams().set('medicalCheckupID', medicalCheckupID);
    console.log(params.toString());
    return this.http.post<Prescription>(
      this.apiPrescriptionUrl + '/byMedicalCheckupID',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteSelectedPrescriptions(
    selectedItems: Array<String>
  ): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiPrescriptionUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updatePrescription(prescription: Prescription, key: string): Observable<Prescription> {
    return this.http.post<Prescription>(
      this.apiPrescriptionUrl + `/updatePrescription/${key}`,
      prescription,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchAll(): Observable<Prescription> {
    return this.http.post<Prescription>(
      this.apiPrescriptionUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
