import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../models/doctor';

@Injectable({
  providedIn: 'root',
})
export class DoctorHttpService {
  constructor(private http: HttpClient) {}
  apiDoctorUrl = 'https://ng-health-care-demo.herokuapp.com/doctors';
  // apiDoctorUrl = 'http://localhost/doctors';

  fetchDoctor(page: number, size: number): Observable<Doctor> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<Doctor>(this.apiDoctorUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  searchDoctorByName(
    value: string,
    page: number,
    size: number
  ): Observable<Doctor> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterDoctorByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<Doctor> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Doctor>(
      this.apiDoctorUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterDoctorByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<Doctor> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterDoctorByRole(
    value: string,
    page: number,
    size: number
  ): Observable<Doctor> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/filterByRole',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterDoctorByAge(
    value: string,
    page: number,
    size: number
  ): Observable<Doctor> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/filterByAge',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterDoctorByGender(
    value: string,
    page: number,
    size: number
  ): Observable<Doctor> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/filterByGender',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortDoctorByName(
    value: string,
    page: number,
    size: number
  ): Observable<Doctor> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortDoctorByPrice(
    value: string,
    page: number,
    size: number
  ): Observable<Doctor> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiDoctorUrl, doctor, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomDoctor(): Observable<Doctor> {
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/randomDoctor',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteAllDoctors(): Observable<Doctor> {
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/deleteAll',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteDoctor(id: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiDoctorUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getDoctor(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(this.apiDoctorUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getDoctorByUserName(userName: string): Observable<Doctor> {
    const params = new HttpParams().set('userName', userName);
    console.log(params.toString());
    return this.http.post<Doctor>(
      this.apiDoctorUrl + '/byUserName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteSelectedDoctors(
    selectedItems: Array<String>
  ): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiDoctorUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateDoctor(doctor: Doctor, key: string): Observable<Doctor> {
    return this.http.post<Doctor>(
      this.apiDoctorUrl + `/updateDoctor/${key}`,
      doctor,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchAll(): Observable<Doctor> {
    return this.http.post<Doctor>(
      this.apiDoctorUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
