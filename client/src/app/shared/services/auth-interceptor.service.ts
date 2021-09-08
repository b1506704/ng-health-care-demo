import {
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpRequest,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StoreService } from './store.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: StoreService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });
      console.log('AUTH REQ:');
      console.log(cloned);
      return next.handle(cloned).pipe(
        tap((event) => {
          if (event.type == HttpEventType.Sent) {
            console.log('Request sent');
            this.store.setResponseProgress(0);
          }
          if (event.type == HttpEventType.DownloadProgress) {
            console.log(event.loaded);
            console.log(event.total);
            const progress = event.loaded / event.total;
            console.log('DOWNLOAD PROGRESS');
            console.log(progress);
            this.store.setResponseProgress(progress);
          }
          if (event.type == HttpEventType.Response) {
            console.log('Content downloaded completely');
          }
        })
      );
    } else {
      console.log(req);
      return next.handle(req);
    }
  }
}
