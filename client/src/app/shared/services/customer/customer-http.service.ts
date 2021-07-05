import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Customer } from '../../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerHttpService {
  constructor(private http: HttpClient) {}
  apiCustomerUrl = 'https://ng-health-care-demo.herokuapp.com/customers';

  fetchCustomer(): Observable<Customer> {
    return this.http
      .get<Customer>(this.apiCustomerUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadCustomer(customer: Customer): Observable<Customer> {
    return this.http
      .post<Customer>(this.apiCustomerUrl, customer, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteCustomer(customer: Customer): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiCustomerUrl + `/${customer.userName}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http
      .post<Customer>(
        this.apiCustomerUrl + `/updateCustomer/${customer.userName}`,
        customer,
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
