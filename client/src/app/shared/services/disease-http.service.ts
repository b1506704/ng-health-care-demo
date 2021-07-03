import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Disease } from '../models/disease';

@Injectable({
  providedIn: 'root',
})
export class DiseaseHTTPService {
  constructor(private http: HttpClient) {}
  apiDiseaseUrl = 'https://ng-health-care-demo.herokuapp.com/diseases';

  fetchDisease(): Observable<Disease> {
    return this.http
      .get<Disease>(this.apiDiseaseUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadDisease(disease: Disease): Observable<Disease> {
    return this.http
      .post<Disease>(this.apiDiseaseUrl, disease, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteDisease(disease: Disease): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiDiseaseUrl + `/${disease.id}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updateDisease(disease: Disease): Observable<Disease> {
    return this.http
      .post<Disease>(
        this.apiDiseaseUrl + `/updateDisease/${disease.id}`,
        disease,
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
