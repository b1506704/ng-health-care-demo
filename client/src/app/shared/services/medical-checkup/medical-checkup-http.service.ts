import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MedicalCheckup } from '../../models/medical-checkup';

@Injectable({
  providedIn: 'root',
})
export class MedicalCheckupHttpService {
  constructor(private http: HttpClient) {}
  apiMedicalCheckupUrl =
    'https://ng-health-care-demo.herokuapp.com/medicalCheckups';

  fetchMedicalCheckup(): Observable<MedicalCheckup> {
    return this.http
      .get<MedicalCheckup>(this.apiMedicalCheckupUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadMedicalCheckup(
    medicalCheckup: MedicalCheckup
  ): Observable<MedicalCheckup> {
    return this.http
      .post<MedicalCheckup>(this.apiMedicalCheckupUrl, medicalCheckup, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteMedicalCheckup(
    medicalCheckup: MedicalCheckup
  ): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(
        this.apiMedicalCheckupUrl + `/${medicalCheckup.id}`,
        {
          reportProgress: true,
          observe: 'body',
        }
      )
      .pipe(catchError(this.handleError));
  }

  updateMedicalCheckup(
    medicalCheckup: MedicalCheckup
  ): Observable<MedicalCheckup> {
    return this.http
      .post<MedicalCheckup>(
        this.apiMedicalCheckupUrl +
          `/updateMedicalCheckup/${medicalCheckup.id}`,
        medicalCheckup,
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
