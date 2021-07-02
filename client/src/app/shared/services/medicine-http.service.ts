import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Medicine } from '../models/medicine';

@Injectable({
  providedIn: 'root',
})
export class MedicineHttpService {
  constructor(private http: HttpClient) {}

  apiMedicineUrl = 'https://ng-health-care-demo.herokuapp.com/medicine';

  fetchMedicine(): Observable<Medicine> {
    return this.http
      .get<Medicine>(this.apiMedicineUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http
      .post<Medicine>(this.apiMedicineUrl, medicine, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteMedicine(medicine: Medicine): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiMedicineUrl + `/${medicine.id}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updateMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http
      .post<Medicine>(
        this.apiMedicineUrl + `/updateMedicine/${medicine.id}`,
        medicine,
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
