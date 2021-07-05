import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  constructor(private http: HttpClient) {}
  apiUserUrl = 'https://ng-health-care-demo.herokuapp.com/users';
  // apiUserUrl = 'http://localhost/users';

  fetchUser(): Observable<User> {
    return this.http
      .get<User>(this.apiUserUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  loginUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiUserUrl + `/${user}`, user, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  logoutUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiUserUrl + `/logout/${user}`, user, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiUserUrl, user, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteUser(user: User): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiUserUrl + `/${user.userName}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updateUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiUserUrl + `/updateUser/${user.userName}`, user, {
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
