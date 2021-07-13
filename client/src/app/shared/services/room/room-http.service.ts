import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../../models/room';

@Injectable({
  providedIn: 'root',
})
export class RoomHttpService {
  constructor(private http: HttpClient) {}
  apiRoomUrl = 'https://ng-health-care-demo.herokuapp.com/rooms';
  // apiRoomUrl = 'http://localhost/rooms';

  fetchRoom(page: number, size: number): Observable<Room> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<Room>(this.apiRoomUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  searchRoomByName(
    value: string,
    page: number,
    size: number
  ): Observable<Room> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Room>(
      this.apiRoomUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterRoomByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<Room> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Room>(
      this.apiRoomUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterRoomByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<Room> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Room>(
      this.apiRoomUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortRoomByName(
    value: string,
    page: number,
    size: number
  ): Observable<Room> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Room>(
      this.apiRoomUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortRoomByPrice(
    value: string,
    page: number,
    size: number
  ): Observable<Room> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Room>(
      this.apiRoomUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiRoomUrl, room, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomRoom(): Observable<Room> {
    return this.http.post<Room>(
      this.apiRoomUrl + '/randomRoom',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteAllRooms(): Observable<Room> {
    return this.http.post<Room>(this.apiRoomUrl + '/deleteAll',{}, {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteRoom(id: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiRoomUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getRoom(id: string): Observable<Room> {
    return this.http.get<Room>(this.apiRoomUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteSelectedRooms(
    selectedItems: Array<String>
  ): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiRoomUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateRoom(room: Room, key: string): Observable<Room> {
    return this.http.post<Room>(
      this.apiRoomUrl + `/updateRoom/${key}`,
      room,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchAll(): Observable<Room> {
    return this.http.post<Room>(
      this.apiRoomUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
