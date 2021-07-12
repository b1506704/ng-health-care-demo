import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Disease } from '../../models/disease';

@Injectable({
  providedIn: 'root',
})
export class DiseaseHttpService {
  constructor(private http: HttpClient) {}
  apiDiseaseUrl = 'https://ng-health-care-demo.herokuapp.com/diseases';
  // apiDiseaseUrl = 'http://localhost/diseases';

  fetchDisease(page: number, size: number): Observable<Disease> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<Disease>(this.apiDiseaseUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  searchDiseaseByName(
    value: string,
    page: number,
    size: number
  ): Observable<Disease> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Disease>(
      this.apiDiseaseUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterDiseaseByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<Disease> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Disease>(
      this.apiDiseaseUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterDiseaseByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<Disease> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Disease>(
      this.apiDiseaseUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortDiseaseByName(
    value: string,
    page: number,
    size: number
  ): Observable<Disease> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Disease>(
      this.apiDiseaseUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortDiseaseByPrice(
    value: string,
    page: number,
    size: number
  ): Observable<Disease> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Disease>(
      this.apiDiseaseUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadDisease(disease: Disease): Observable<Disease> {
    return this.http.post<Disease>(this.apiDiseaseUrl, disease, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomDisease(): Observable<Disease> {
    return this.http.post<Disease>(this.apiDiseaseUrl + '/randomDisease', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteAllDiseases(): Observable<Disease> {
    return this.http.post<Disease>(this.apiDiseaseUrl + '/deleteAll', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteDisease(id: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiDiseaseUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getDisease(id: string): Observable<Disease> {
    return this.http.get<Disease>(this.apiDiseaseUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteSelectedDiseases(
    selectedItems: Array<String>
  ): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiDiseaseUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateDisease(disease: Disease, key: string): Observable<Disease> {
    return this.http.post<Disease>(
      this.apiDiseaseUrl + `/updateDisease/${key}`,
      disease,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchAll(): Observable<Disease> {
    return this.http.post<Disease>(
      this.apiDiseaseUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
