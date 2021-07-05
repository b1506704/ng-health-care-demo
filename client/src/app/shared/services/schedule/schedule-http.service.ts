import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Schedule } from '../../models/schedule';

@Injectable({
  providedIn: 'root',
})
export class ScheduleHttpService {
  constructor(private http: HttpClient) {}
  apiScheduleUrl = 'https://ng-health-care-demo.herokuapp.com/schedules';

  fetchSchedule(): Observable<Schedule> {
    return this.http
      .get<Schedule>(this.apiScheduleUrl, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  uploadSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http
      .post<Schedule>(this.apiScheduleUrl, schedule, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  deleteSchedule(schedule: Schedule): Observable<ArrayBuffer> {
    return this.http
      .delete<ArrayBuffer>(this.apiScheduleUrl + `/${schedule.id}`, {
        reportProgress: true,
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  updateSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http
      .post<Schedule>(
        this.apiScheduleUrl + `/updateSchedule/${schedule.id}`,
        schedule,
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
