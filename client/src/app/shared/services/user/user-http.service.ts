import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  constructor(private http: HttpClient) {}
  apiUserUrl = 'https://ng-health-care-demo.herokuapp.com/users';
  // apiUserUrl = 'http://localhost/users';

  fetchUser(page: number, size: number): Observable<User> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<User>(this.apiUserUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  searchUserByName(
    value: string,
    page: number,
    size: number
  ): Observable<User> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<User>(
      this.apiUserUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterUserByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<User> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<User>(
      this.apiUserUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterUserByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<User> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<User>(
      this.apiUserUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterUserByJob(value: string, page: number, size: number): Observable<User> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<User>(
      this.apiUserUrl + '/filterByJob',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterUserByGender(
    value: string,
    page: number,
    size: number
  ): Observable<User> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<User>(
      this.apiUserUrl + '/filterByGender',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortUserByName(value: string, page: number, size: number): Observable<User> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<User>(
      this.apiUserUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortUserByPrice(value: string, page: number, size: number): Observable<User> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<User>(
      this.apiUserUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUserUrl, user, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomUser(): Observable<User> {
    return this.http.post<User>(
      this.apiUserUrl + '/randomUser',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteAllUsers(): Observable<User> {
    return this.http.post<User>(
      this.apiUserUrl + '/deleteAll',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteUser(id: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiUserUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(this.apiUserUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteSelectedUsers(selectedItems: Array<String>): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiUserUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateUser(user: User, key: string): Observable<User> {
    return this.http.post<User>(this.apiUserUrl + `/updateUser/${key}`, user, {
      reportProgress: true,
      observe: 'body',
    });
  }

  fetchAll(): Observable<User> {
    return this.http.post<User>(
      this.apiUserUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  loginUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiUserUrl + '/login', user, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(shareReplay());
  }

  logoutUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUserUrl + '/logout', user, {
      reportProgress: true,
      observe: 'body',
    });
  }
}
