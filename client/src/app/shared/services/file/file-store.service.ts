import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import saveAs from 'file-saver';
import { File } from '../../models/file';
import { Container } from '../../models/container';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { FileHttpService } from './file-http.service';
import { confirm } from 'devextreme/ui/dialog';

interface FileState {
  fileList: Array<File>;
  containerList: Array<Container>;
  isUploading: boolean;
  isUploadingFolder: boolean;
  isUpdatingFolder: boolean;
  exportData: Array<File>;
  selectedFile: Object;
  fileInstance: File;
  downloadedFile: any;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: FileState = {
  fileList: [],
  containerList: [],
  isUploading: false,
  isUploadingFolder: false,
  isUpdatingFolder: false,
  selectedFile: {},
  fileInstance: undefined,
  downloadedFile: undefined,
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class FileStore extends StateService<FileState> {
  constructor(
    private fileService: FileHttpService,
    private store: StoreService
  ) {
    super(initialState);
  }

  fetchSelectedFiles(source: Array<any>) {
    const sourceIDs = source.map((e) => e._id);
    console.log('ARRAY OF IDs');
    console.log(sourceIDs);
    this.store.setIsLoading(true);
    this.fileService.fetchSelectedFiles(sourceIDs).subscribe((data: any) => {
      this.store.setIsLoading(false);
      if (data !== null) {
        this.setState({ fileList: this.state.fileList.concat(data) });
        console.log('FETCHED FILES');
        console.log(data);
        // this.store.setIsLoading(false);
      }
    });
  }

  initInfiniteDataByContainer(container: string, size: number) {
    this.setIsLoading(true);
    return this.fileService
      .fetchFilesByContainer(container, size)
      .toPromise()
      .then((data: any) => {
        this.setState({ fileList: [] });
        this.setState({
          fileList: data.items,
        });
        console.log('Current flag: infite list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      });
  }

  loadInfiniteDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.fetchFile(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          fileList: this.state.fileList.concat(data.items),
        });
        console.log('Infinite list');
        console.log(this.state.fileList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  initInfiniteFilterByCategoryData(value: string, page: number, size: number) {
    // this.store.showNotif('Filtered Mode On', 'custom');
    this.setState({ fileList: [] });
    this.store.setIsLoading(true);
    return this.fileService
      .filterFileByCategory(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          fileList: this.state.fileList.concat(data.items),
        });
        console.log('Current flag: infinite filtered list');
        console.log(this.state.fileList);
        this.store.setIsLoading(false);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      });
    // .then(() => {
    //   this.filterFileByCategory(value, page, size);
    // });
  }

  initInfiniteSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.setIsLoading(true);
    this.fileService
      .searchFileByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            fileList: this.state.fileList.concat(data.items),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      });
  }

  initInfiniteSortByPriceData(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.store.showNotif('Sort Mode On', 'custom');
    this.fileService
      .sortFileByPrice(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          fileList: this.state.fileList.concat(data.items),
        });
        console.log('Current flag: sort list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      });
  }

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $fileList: Observable<Array<File>> = this.select((state) => state.fileList);

  $containerList: Observable<Array<Container>> = this.select(
    (state) => state.containerList
  );

  $exportData: Observable<Array<File>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedFile: Observable<Object> = this.select(
    (state) => state.selectedFile
  );

  $fileInstance: Observable<File> = this.select((state) => state.fileInstance);

  $downloadedFileInstance: Observable<any> = this.select(
    (state) => state.fileInstance
  );

  $isUploading: Observable<boolean> = this.select((state) => state.isUploading);

  $isUploadingFolder: Observable<boolean> = this.select(
    (state) => state.isUploadingFolder
  );

  $isUpdatingFolder: Observable<boolean> = this.select(
    (state) => state.isUpdatingFolder
  );

  uploadFile(file: File) {
    this.setIsLoading(true);
    this.setisUploading(true);
    this.fileService.uploadFile(file).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
        this.setIsLoading(false);
        this.setisUploading(false);
        this.store.showNotif(data.message, 'custom');
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  downloadFile(fileName: string, container: string) {
    this.setIsLoading(true);
    this.fileService.downloadFile(fileName, container).subscribe({
      next: (data: any) => {
        console.log(data);
        saveAs(data.url, data.name, { type: data.type });
        this.setIsLoading(false);
        this.store.showNotif(`'${fileName}' downloaded`, 'custom');
      },
      error: (data: any) => {
        this.setIsLoading(false);
        console.log(data);
      },
    });
  }

  downloadFiles(selectedItems: Array<string>, container: string) {
    this.setIsLoading(true);
    const currentDate = new Date();
    this.fileService.downloadFiles(selectedItems, container).subscribe({
      next: (data: any) => {
        let blob: any = new Blob([data], { type: 'application/zip' });
        saveAs(blob, `${currentDate.toLocaleDateString()}.zip`);
        this.store.showNotif('1 zip downloaded', 'custom');
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.store.showNotif(data.error.errorMessage, 'error');
        this.setIsLoading(false);
        console.log(data);
      },
    });
  }

  updateFile(file: File, key: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.fileService.updateFile(file, key).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.setIsLoading(false);
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  uploadFiles(selectedFiles: Array<File>, container: string) {
    this.setIsLoading(true);
    this.setisUploading(true);
    this.fileService.uploadFiles(selectedFiles, container).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
        this.setIsLoading(false);
        this.setisUploading(false);
        this.store.showNotif(data.message, 'custom');
      },
      error: (data: any) => {
        this.store.showNotif(data.error.errorMessage, 'error');
        this.setIsLoading(false);
        this.setisUploading(false);
        console.log(data);
      },
    });
  }

  confirmDialog(msg: string) {
    if (msg != '') {
      return confirm(`<b>${msg}</b>`, 'Confirm changes');
    }
    return confirm(`<b>Are you sure?</b>`, 'Confirm changes');
  }

  copySelectedFiles(
    selectedFiles: Array<string>,
    sourceContainer: string,
    destinationContainer: string
  ) {
    this.setIsLoading(true);
    return this.fileService
      .copyFiles(selectedFiles, sourceContainer, destinationContainer)
      .toPromise();
  }

  moveSelectedFiles(
    selectedFiles: Array<string>,
    sourceContainer: string,
    destinationContainer: string
  ) {
    this.setIsLoading(true);
    return this.fileService
      .moveFiles(selectedFiles, sourceContainer, destinationContainer)
      .toPromise();
  }

  deleteSelectedFiles(selectedFiles: Array<string>, container: string) {
    this.setIsLoading(true);
    return this.fileService
      .deleteSelectedFiles(selectedFiles, container)
      .toPromise();
  }

  deleteAllFiles() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.fileService.deleteAllFiles().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ fileList: [] });
            this.setState({ totalPages: 0 });
            this.setState({ currentPage: 0 });
            this.setState({ totalItems: 0 });
            console.log(data);
            this.setIsLoading(false);
            this.store.showNotif(data.message, 'custom');
          },
          error: (data: any) => {
            this.setIsLoading(false);
            this.store.showNotif(data.error.errorMessage, 'error');
            console.log(data);
          },
        });
      }
    });
  }

  deleteFile(name: string, container: string) {
    this.setIsLoading(true);
    return this.fileService.deleteFile(name, container).toPromise();
  }

  selectFile(_file: File) {
    this.setState({ selectedFile: _file });
  }

  setTotalPages(_totalPages: number) {
    this.setState({ totalPages: _totalPages });
  }

  setTotalItems(_totalItems: number) {
    this.setState({ totalItems: _totalItems });
  }

  setCurrentPage(_currentPage: number) {
    this.setState({ currentPage: _currentPage });
  }

  filterInfiniteFileByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.filterFileByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          fileList: this.state.fileList.concat(data.items),
        });
        console.log('Filtered list');
        console.log(this.state.fileList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  searchInfiniteFileByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.searchFileByName(value, page, size).subscribe({
      next: (data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            fileList: this.state.fileList.concat(data.items),
          });
        } else {
          this.store.showNotif('No result found!', 'custome');
        }
        console.log('Infite searched list');
        console.log(this.state.fileList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  sortInfiniteFileByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.sortFileByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          fileList: this.state.fileList.concat(data.items),
        });
        console.log('Infite sorted list');
        console.log(this.state.fileList);
        console.log('Server response');
        console.log(data);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  getFile(id: string) {
    this.setIsLoading(true);
    return this.fileService
      .getFile(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ fileInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  getFileBySourceID(id: string) {
    this.setIsLoading(true);
    return this.fileService
      .getFileBySourceID(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ fileInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  setisUploading(isFetching: boolean) {
    this.setState({ isUploading: isFetching });
  }

  setisUploadingFolder(isFetching: boolean) {
    this.setState({ isUploadingFolder: isFetching });
  }

  setisUpdatingFolder(isFetching: boolean) {
    this.setState({ isUpdatingFolder: isFetching });
  }

  // container functions

  initInfiniteContainer(page: number, size: number) {
    this.setIsLoading(true);
    return this.fileService
      .fetchContainer(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          containerList: data.items,
        });
        console.log('Current flag: infite list');
        console.log(this.state.containerList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        this.setIsLoading(false);
      });
  }
  uploadContainer(container: Container) {
    this.setIsLoading(true);
    this.setisUploadingFolder(true);
    this.fileService.uploadContainer(container).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
        this.setIsLoading(false);
        this.setisUploadingFolder(false);
        this.store.showNotif(data.message, 'custom');
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.setisUploadingFolder(false);
        this.store.showNotif(data.errorMessage.message, 'custom');
        console.log(data);
      },
    });
  }

  updateContainer(container: string, newContainer: string) {
    this.setIsLoading(true);
    this.setisUpdatingFolder(true);
    this.fileService.updateContainer(container, newContainer).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
        this.setIsLoading(false);
        this.setisUpdatingFolder(false);
        this.store.showNotif(data.message, 'custom');
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.setisUpdatingFolder(false);
        this.store.showNotif(data.errorMessage.message, 'custom');
        console.log(data);
      },
    });
  }

  deleteContainer(container: string) {
    this.setIsLoading(true);
    return this.fileService.deleteContainer(container).toPromise();
  }

  cloneContainer(container: string) {
    this.setIsLoading(true);
    return this.fileService.cloneContainer(container).toPromise();
  }
}
