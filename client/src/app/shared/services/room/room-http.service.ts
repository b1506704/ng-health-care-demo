import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Room } from '../../models/room';

@Injectable({
  providedIn: 'root',
})
export class RoomHttpService {
  constructor(private http: HttpClient) {}
  apiRoomUrl = 'https://ng-health-care-demo.herokuapp.com/rooms';

  fetchRoom(): Observable<Room> {
    return this.http
      .get<Room>(this.apiRoomUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadRoom(room: Room): Observable<Room> {
    return this.http
      .post<Room>(this.apiRoomUrl, room, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteRoom(room: Room): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiRoomUrl + `/${room.id}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http
      .post<Room>(this.apiRoomUrl + `/updateRoom/${room.id}`, room, {
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
