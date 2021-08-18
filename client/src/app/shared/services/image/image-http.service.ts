import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../../models/image';

@Injectable({
  providedIn: 'root',
})
export class ImageHttpService {
  constructor(private http: HttpClient) {}
  apiImageUrl = 'https://ng-health-care-demo.herokuapp.com/images';
  // apiImageUrl = 'http://localhost/images';

  fetchImage(page: number, size: number): Observable<Image> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<Image>(this.apiImageUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  fetchSelectedImages(
    selectedItems: Array<string>
  ): Observable<Array<Image>> {
    return this.http.post<Array<Image>>(
      this.apiImageUrl + '/fetchBatch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  searchImageByName(
    value: string,
    page: number,
    size: number
  ): Observable<Image> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Image>(
      this.apiImageUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterImageByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<Image> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Image>(
      this.apiImageUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterImageByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<Image> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Image>(
      this.apiImageUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortImageByName(
    value: string,
    page: number,
    size: number
  ): Observable<Image> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Image>(
      this.apiImageUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortImageByPrice(
    value: string,
    page: number,
    size: number
  ): Observable<Image> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<Image>(
      this.apiImageUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadImage(image: Image): Observable<Image> {
    return this.http.post<Image>(this.apiImageUrl, image, {
      reportProgress: true,
      observe: 'body',
    });
  }

  generateRandomImage(): Observable<Image> {
    return this.http.post<Image>(this.apiImageUrl + '/randomImage', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteAllImages(): Observable<Image> {
    return this.http.post<Image>(this.apiImageUrl + '/deleteAll', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteImage(sourceID: string): Observable<ArrayBuffer> {
    return this.http.delete<ArrayBuffer>(this.apiImageUrl + `/${sourceID}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getImage(id: string): Observable<Image> {
    return this.http.get<Image>(this.apiImageUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getImageBySourceID(sourceID: string): Observable<Image> {
    const params = new HttpParams().set('sourceID', sourceID);
    console.log(params.toString());
    return this.http.post<Image>(
      this.apiImageUrl + '/bySourceID',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteSelectedImages(
    selectedItems: Array<String>
  ): Observable<Array<String>> {
    return this.http.post<Array<String>>(
      this.apiImageUrl + '/batch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateImage(image: Image, key: string): Observable<Image> {
    return this.http.post<Image>(
      this.apiImageUrl + `/updateImage/${key}`,
      image,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchAll(): Observable<Image> {
    return this.http.post<Image>(
      this.apiImageUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
