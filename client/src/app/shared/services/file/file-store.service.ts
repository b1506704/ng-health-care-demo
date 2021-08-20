import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { File } from '../../models/file';
import { Container } from '../../models/container';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { FileHttpService } from './file-http.service';
import { confirm } from 'devextreme/ui/dialog';
import { MedicalCheckupStore } from '../medical-checkup/medical-checkup-store.service';

interface FileState {
  fileList: Array<File>;
  containerList: Array<Container>;
  isUploading: boolean;
  exportData: Array<File>;
  selectedFile: Object;
  fileInstance: File;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: FileState = {
  fileList: [],
  containerList: [],
  isUploading: false,
  selectedFile: {},
  fileInstance: undefined,
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
    private store: StoreService,
    private medicalCheckupService: MedicalCheckupStore
  ) {
    super(initialState);
  }
  /**
   * This is a function which fills the items received from pagination in a specific store's state variable.
   * 
   * @author Le Bao Anh
   * @version 1.0.0
   * @param {number} startIndex - The current page of ss pagination
   * @param {number} endIndex - The page size of ss pagination
   * @param {Array<Object>} sourceArray - The source array/state in a specific store service
   * @param {Array<Object>} addedArray - The array of items received from ss pagination
   * @return {Array<Object>} Return an array with filled items from ss pagination
   * @example
   * this.setState({
            pendingCheckupList: this.fillEmpty(
              page,
              size,
              this.state.pendingCheckupList,
              data.items
            ),
          });
   */
  fillEmpty(
    startIndex: number,
    endIndex: number,
    sourceArray: Array<File>,
    addedArray: Array<File>
  ): Array<File> {
    let result: Array<File> = sourceArray;
    let fillIndex = startIndex * endIndex;
    for (var j = 0; j < addedArray.length; j++) {
      result[fillIndex] = addedArray[j];
      fillIndex++;
    }
    // endIndex = pageSize
    // pageSize = 5
    // 0 => 0 ,1,2,3,4,
    // 1 -> 5,6,7,8,9
    // 2 -> 10,11,12,13,14
    // 17 -> 85,86,87,88,89
    console.log('Filled array result');
    console.log(result);
    return result;
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

  initInfiniteData(page: number, size: number) {
    return this.fileService
      .fetchFile(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          fileList: new Array<File>(data.items.length),
        });
        console.log('Current flag: infite list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.loadDataAsync(page, size);
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

  initData(page: number, size: number) {
    this.fileService
      .fetchFile(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          fileList: new Array<File>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.loadDataAsync(page, size);
      });
  }

  initFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.fileService
      .filterFileByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          fileList: new Array<File>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterFileByCategory(value, page, size);
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

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.fileService
      .searchFileByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          fileList: new Array<File>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchFileByName(value, page, size);
      });
  }

  initInfiniteSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.fileService
      .searchFileByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            fileList: new Array<File>(size),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchFileByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.fileService
      .sortFileByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          fileList: new Array<File>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortFileByPrice(value, page, size);
      });
  }

  initInfiniteSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.fileService
      .sortFileByPrice(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          fileList: new Array<File>(size),
        });
        console.log('Current flag: sort list');
        console.log(this.state.fileList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortFileByPrice(value, page, size);
      });
  }

  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.fetchFile(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          fileList: this.fillEmpty(page, size, this.state.fileList, data.items),
        });
        console.log('Pure list');
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

  refresh(page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.fetchFile(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          fileList: this.fillEmpty(page, size, this.state.fileList, data.items),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.fileList);
        console.log('Server response');
        console.log(data);
        this.store.showNotif('Refresh successfully', 'custom');
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
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

  $isUploading: Observable<boolean> = this.select((state) => state.isUploading);

  uploadFile(file: File, page: number, size: number) {
    this.setIsLoading(true);
    this.setisUploading(true);
    this.fileService.uploadFile(file).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setTotalItems(this.state.totalItems + 1);
        console.log(data);
        // this.loadDataAsync(page, size);
        this.getFileBySourceID(file?.sourceID);
        this.setIsLoading(false);
        this.setisUploading(false);
      },
      error: (data: any) => {
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
            this.loadDataAsync(page, size);
            this.medicalCheckupService.initCompleteInfiniteData(page, size);
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

  confirmDialog(msg: string) {
    if (msg != '') {
      return confirm(`<b>${msg}</b>`, 'Confirm changes');
    }
    return confirm(`<b>Are you sure?</b>`, 'Confirm changes');
  }

  deleteSelectedFiles(selectedFiles: Array<string>) {
    this.setIsLoading(true);
    return this.fileService.deleteSelectedFiles(selectedFiles).toPromise();
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

  deleteFile(id: string) {
    this.setIsLoading(true);
    return this.fileService.deleteFile(id).toPromise();
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

  filterFileByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.fileService.filterFileByPrice(criteria, value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          fileList: this.fillEmpty(page, size, this.state.fileList, data.items),
        });
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

  filterFileByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.filterFileByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          fileList: this.fillEmpty(page, size, this.state.fileList, data.items),
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

  searchFileByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.searchFileByName(value, page, size).subscribe({
      next: (data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            fileList: this.fillEmpty(
              page,
              size,
              this.state.fileList,
              data.items
            ),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Searched list');
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

  sortFileByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.sortFileByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          fileList: this.fillEmpty(page, size, this.state.fileList, data.items),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.fileList);
        console.log('Server response');
        console.log(data);
        this.setIsLoading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  sortFileByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.fileService.sortFileByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          fileList: this.fillEmpty(page, size, this.state.fileList, data.items),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.fileList);
        console.log('Server response');
        console.log(data);
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

  setExportData(array: Array<File>) {
    this.setState({ fileList: array });
  }
  // container functions

  initInfiniteContainer(page: number, size: number) {
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
      });
  }
  uploadContainer(container: Container) {
    this.setIsLoading(true);
    this.setisUploading(true);
    this.fileService.uploadContainer(container).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setTotalItems(this.state.totalItems + 1);
        console.log(data);
        this.setIsLoading(false);
        this.setisUploading(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        console.log(data);
      },
    });
  }
}
