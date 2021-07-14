import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from '../../models/schedule';

@Injectable({
  providedIn: 'root',
})
export class ScheduleHttpService {
  constructor(private http: HttpClient) {}
  apiScheduleUrl = 'https://ng-health-care-demo.herokuapp.com/schedules';
  // apiScheduleUrl = 'http://localhost/schedules';

  fetchSchedule(page: number, size: number): Observable<Schedule> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<Schedule>(this.apiScheduleUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  searchScheduleByName(
    value: string,
    page: number,
    size: number
  ): Observable<Schedule> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Schedule>(
      this.apiScheduleUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterScheduleByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<Schedule> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Schedule>(
      this.apiScheduleUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterScheduleByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<Schedule> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Schedule>(
      this.apiScheduleUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortScheduleByName(
    value: string,
    page: number,
    size: number
  ): Observable<Schedule> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Schedule>(
      this.apiScheduleUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortScheduleByPrice(
    value: string,
    page: number,
    size: number
  ): Observable<Schedule> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Schedule>(
      this.apiScheduleUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(this.apiScheduleUrl, schedule, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomSchedule(): Observable<Schedule> {
    return this.http.post<Schedule>(
      this.apiScheduleUrl + '/randomSchedule',
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteAllSchedules(): Observable<Schedule> {
    return this.http.post<Schedule>(this.apiScheduleUrl + '/deleteAll',{}, {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteSchedule(id: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiScheduleUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getSchedule(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(this.apiScheduleUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteSelectedSchedules(
    selectedItems: Array<String>
  ): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiScheduleUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateSchedule(schedule: Schedule, key: string): Observable<Schedule> {
    return this.http.post<Schedule>(
      this.apiScheduleUrl + `/updateSchedule/${key}`,
      schedule,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchAll(): Observable<Schedule> {
    return this.http.post<Schedule>(
      this.apiScheduleUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
