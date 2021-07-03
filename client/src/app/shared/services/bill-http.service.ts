import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Bill } from '../models/bill';

@Injectable({
  providedIn: 'root',
})
export class BillHttpService {
  constructor(private http: HttpClient) {}
  apiBillUrl = 'https://ng-health-care-demo.herokuapp.com/bills';

  fetchBill(): Observable<Bill> {
    return this.http
      .get<Bill>(this.apiBillUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadBill(bill: Bill): Observable<Bill> {
    return this.http
      .post<Bill>(this.apiBillUrl, bill, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteBill(bill: Bill): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiBillUrl + `/${bill.id}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updateBill(bill: Bill): Observable<Bill> {
    return this.http
      .post<Bill>(this.apiBillUrl + `/updateBill/${bill.id}`, bill, {
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
