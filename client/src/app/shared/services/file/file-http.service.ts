import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { File } from '../../models/file';
import { Container } from '../../models/container';

@Injectable({
  providedIn: 'root',
})
export class FileHttpService {
  constructor(private http: HttpClient) {}
  apiFileUrl = 'https://ng-health-care-demo.herokuapp.com/files';
  // apiFileUrl = 'http://localhost/files';

  fetchContainer(page: number, size: number): Observable<Container> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<Container>(this.apiFileUrl + '/getContainers', {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  uploadContainer(container: Container): Observable<Container> {
    return this.http.post<Container>(
      this.apiFileUrl + '/uploadContainer',
      container,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateContainer(container: string, newContainer: string): Observable<any> {
    return this.http.post<any>(
      this.apiFileUrl + '/updateContainer',
      { container, newContainer },
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteContainer(container: string): Observable<any> {
    const params = new HttpParams().set('name', container);
    return this.http.post<any>(
      this.apiFileUrl + '/deleteContainer',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  cloneContainer(container: string): Observable<any> {
    return this.http.post<any>(
      this.apiFileUrl + '/cloneContainer',
      { container },
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchFile(page: number, size: number): Observable<File> {
    const params = new HttpParams().set('page', page).set('size', size);
    console.log(params.toString());
    return this.http.get<File>(this.apiFileUrl, {
      params: params,
      reportProgress: true,
      observe: 'body',
    });
  }

  fetchSelectedFiles(selectedItems: Array<string>): Observable<Array<File>> {
    return this.http.post<Array<File>>(
      this.apiFileUrl + '/fetchBatch',
      selectedItems,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  fetchFilesByContainer(
    container: string,
    size: number
  ): Observable<Array<File>> {
    return this.http.post<Array<File>>(
      this.apiFileUrl + '/byContainer',
      { directory: container, pageSize: size },
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  searchFileByName(
    value: string,
    page: number,
    size: number
  ): Observable<File> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<File>(
      this.apiFileUrl + '/searchByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterFileByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ): Observable<File> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<File>(
      this.apiFileUrl,
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  filterFileByCategory(
    value: string,
    page: number,
    size: number
  ): Observable<File> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<File>(
      this.apiFileUrl + '/filterByCategory',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortFileByName(value: string, page: number, size: number): Observable<File> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<File>(
      this.apiFileUrl + '/sortByName',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  sortFileByPrice(value: string, page: number, size: number): Observable<File> {
    const params = new HttpParams()
      .set('value', value)
      .set('page', page)
      .set('size', size);
    console.log(params.toString());
    return this.http.post<File>(
      this.apiFileUrl + '/sortByPrice',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  uploadFile(file: File): Observable<File> {
    return this.http.post<File>(this.apiFileUrl + '/upload', file, {
      reportProgress: true,
      observe: 'body',
    });
  }

  uploadFiles(selectedItems: Array<File>, container: string): Observable<any> {
    return this.http.post<any>(
      this.apiFileUrl + '/batch/upload',
      { selectedItems, container },
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  downloadFile(fileName: string, container: string): Observable<any> {
    return this.http.post<any>(
      this.apiFileUrl + '/download',
      { name: fileName, container: container },
      {
        reportProgress: true,
      }
    );
  }

  downloadFiles(
    selectedItems: Array<string>,
    container: string
  ): Observable<any> {
    return this.http.post(
      this.apiFileUrl + '/batch/download',
      { selectedItems: selectedItems, container: container },
      {
        responseType: 'blob',
        reportProgress: true,
      }
    );
  }

  generateRandomFile(): Observable<File> {
    return this.http.post<File>(this.apiFileUrl + '/randomFile', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteAllFiles(): Observable<File> {
    return this.http.post<File>(this.apiFileUrl + '/deleteAll', {
      reportProgress: true,
      observe: 'body',
    });
  }

  deleteFile(name: string, container: string): Observable<any> {
    return this.http.post<any>(
      this.apiFileUrl + '/delete',
      {
        name,
        container,
      },
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  copyFiles(
    selectedItems: Array<string>,
    sourceContainer: string,
    destinationContainer: string
  ): Observable<any> {
    return this.http.post<any>(
      this.apiFileUrl + '/batch/copy',
      {
        selectedItems,
        sourceContainer,
        destinationContainer,
      },
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  moveFiles(
    selectedItems: Array<string>,
    sourceContainer: string,
    destinationContainer: string
  ): Observable<any> {
    return this.http.post<any>(
      this.apiFileUrl + '/batch/move',
      {
        selectedItems,
        sourceContainer,
        destinationContainer,
      },
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  getFile(id: string): Observable<File> {
    return this.http.get<File>(this.apiFileUrl + `/${id}`, {
      reportProgress: true,
      observe: 'body',
    });
  }

  getFileBySourceID(sourceID: string): Observable<File> {
    const params = new HttpParams().set('sourceID', sourceID);
    console.log(params.toString());
    return this.http.post<File>(
      this.apiFileUrl + '/bySourceID',
      {},
      {
        params: params,
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  deleteSelectedFiles(
    selectedItems: Array<String>,
    container: string
  ): Observable<any> {
    return this.http.post<any>(
      this.apiFileUrl + '/batch/delete',
      { selectedItems, container },
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }

  updateFile(file: File, key: string): Observable<File> {
    return this.http.post<File>(this.apiFileUrl + `/updateFile/${key}`, file, {
      reportProgress: true,
      observe: 'body',
    });
  }

  fetchAll(): Observable<File> {
    return this.http.post<File>(
      this.apiFileUrl + `/fetchAll`,
      {},
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
}
