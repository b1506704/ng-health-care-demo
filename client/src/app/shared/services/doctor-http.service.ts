import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Doctor } from '../models/doctor';

@Injectable({
  providedIn: 'root',
})
export class DoctorHttpService {
  constructor(private http: HttpClient) {}
  apiDoctorUrl = 'https://ng-health-care-demo.herokuapp.com/doctors';

  fetchDoctor(): Observable<Doctor> {
    return this.http
      .get<Doctor>(this.apiDoctorUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http
      .post<Doctor>(this.apiDoctorUrl, doctor, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteDoctor(doctor: Doctor): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiDoctorUrl + `/${doctor.id}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updateDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http
      .post<Doctor>(this.apiDoctorUrl + `/updateDoctor/${doctor.id}`, doctor, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
