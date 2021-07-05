import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Image } from '../../models/image';

@Injectable({
  providedIn: 'root',
})
export class ImageHttpService {
  constructor(private http: HttpClient) {}
  apiImageUrl = 'https://ng-health-care-demo.herokuapp.com/images';

  fetchImage(): Observable<Image> {
    return this.http
      .get<Image>(this.apiImageUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadImage(image: Image): Observable<Image> {
    return this.http
      .post<Image>(this.apiImageUrl, image, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteImage(image: Image): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiImageUrl + `/${image.id}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updateImage(image: Image): Observable<Image> {
    return this.http
      .post<Image>(this.apiImageUrl + `/updateImage/${image.id}`, image, {
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
