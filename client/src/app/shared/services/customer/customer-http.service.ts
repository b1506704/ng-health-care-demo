import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerHttpService {
  constructor(private http: HttpClient) {}
  apiCustomerUrl = 'https://ng-health-care-demo.herokuapp.com/customers';
  // apiCustomerUrl = 'http://localhost/customers';

  fetchCustomer(page: number, size: number): Observable<Customer> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<Customer>(this.apiCustomerUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  searchCustomerByName(
    value: string,
    page: number,
    size: number
  ): Observable<Customer> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Customer>(
      this.apiCustomerUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterCustomerByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<Customer> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Customer>(
      this.apiCustomerUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterCustomerByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<Customer> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Customer>(
      this.apiCustomerUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterCustomerByJob(
    value: string,
    page: number,
    size: number
  ): Observable<Customer> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Customer>(
      this.apiCustomerUrl + '/filterByJob',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterCustomerByGender(
    value: string,
    page: number,
    size: number
  ): Observable<Customer> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Customer>(
      this.apiCustomerUrl + '/filterByGender',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortCustomerByName(
    value: string,
    page: number,
    size: number
  ): Observable<Customer> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Customer>(
      this.apiCustomerUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortCustomerByPrice(
    value: string,
    page: number,
    size: number
  ): Observable<Customer> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Customer>(
      this.apiCustomerUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiCustomerUrl, customer, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomCustomer(): Observable<Customer> {
    return this.http.post<Customer>(
      this.apiCustomerUrl + '/randomCustomer',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteAllCustomers(): Observable<Customer> {
    return this.http.post<Customer>(
      this.apiCustomerUrl + '/deleteAll',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteCustomer(id: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiCustomerUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(this.apiCustomerUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getCustomerByUserName(userName: string): Observable<Customer> {
    const params = new HttpParams().set('userName', userName);
    console.log(params.toString());
    return this.http.post<Customer>(
      this.apiCustomerUrl + '/byUserName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteSelectedCustomers(
    selectedItems: Array<String>
  ): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiCustomerUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateCustomer(customer: Customer, key: string): Observable<Customer> {
    return this.http.post<Customer>(
      this.apiCustomerUrl + `/updateCustomer/${key}`,
      customer,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchAll(): Observable<Customer> {
    return this.http.post<Customer>(
      this.apiCustomerUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
