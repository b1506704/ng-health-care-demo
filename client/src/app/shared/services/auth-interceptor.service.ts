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
          //todo: manage response progress array
          // const miliseconds = new Date().valueOf();
          if (event.type == HttpEventType.Sent) {
            console.log('Request sent');            
            // this.store.addResponse({id: miliseconds, type: 'Requesting', progress: 0});
            // this.store.setResponseEventType('Requesting');
            this.store.setResponseProgress(0);
          }
          if (event.type == HttpEventType.DownloadProgress) {
            console.log(event.loaded);
            console.log(event.total);
            const progress = (event.loaded / event.total) * 100;
            console.log('DOWNLOAD PROGRESS');
            console.log(progress);
            // this.store.setResponseEventType('Downloading');
            this.store.setResponseProgress(progress);
          }
          if (event.type == HttpEventType.UploadProgress) {
            console.log(event.loaded);
            console.log(event.total);
            const progress = (event.loaded / event.total) * 100;
            console.log('UPLOAD PROGRESS');
            console.log(progress);
            // this.store.setResponseEventType('Sending');
            this.store.setResponseProgress(progress);
          }
          if (event.type == HttpEventType.Response) {
            // this.store.setResponseEventType('Finishing');
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
