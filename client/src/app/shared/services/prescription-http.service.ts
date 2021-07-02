import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Prescription } from '../models/prescription';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionHttpService {
  constructor(private http: HttpClient) {}
  apiPrescriptionUrl = 'https://ng-health-care-demo.herokuapp.com/prescription';

  fetchPrescription(): Observable<Prescription> {
    return this.http
      .get<Prescription>(this.apiPrescriptionUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadPrescription(prescription: Prescription): Observable<Prescription> {
    return this.http
      .post<Prescription>(this.apiPrescriptionUrl, prescription, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deletePrescription(prescription: Prescription): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiPrescriptionUrl + `/${prescription.id}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updatePrescription(prescription: Prescription): Observable<Prescription> {
    return this.http
      .post<Prescription>(
        this.apiPrescriptionUrl + `/updatePrescription/${prescription.id}`,
        prescription,
        {
          reportProgress: true,
          observe: 'body',
        }
      )
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
