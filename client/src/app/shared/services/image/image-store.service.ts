import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../../models/image';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { ImageHttpService } from './image-http.service';
import { confirm } from 'devextreme/ui/dialog';
import { MedicalCheckupStore } from '../medical-checkup/medical-checkup-store.service';

interface ImageState {
  imageList: Array<Image>;
  isUploadingImage: boolean;
  exportData: Array<Image>;
  selectedImage: Object;
  imageInstance: Image;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: ImageState = {
  imageList: [],
  isUploadingImage: false,
  selectedImage: {},
  imageInstance: undefined,
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class ImageStore extends StateService<ImageState> {
  constructor(
    private imageService: ImageHttpService,
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
    sourceArray: Array<Image>,
    addedArray: Array<Image>
  ): Array<Image> {
    let result: Array<Image> = sourceArray;
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

  fetchSelectedImages(source: Array<any>) {
    const sourceIDs = source.map((e) => e._id);
    console.log('ARRAY OF IDs');
    console.log(sourceIDs);
    this.store.setIsLoading(true);
    this.imageService.fetchSelectedImages(sourceIDs).subscribe((data: any) => {
      this.store.setIsLoading(false);
      if (data !== null) {
        this.setState({ imageList: this.state.imageList.concat(data) });
        console.log('FETCHED IMAGES');
        console.log(data);
        // this.store.setIsLoading(false);
      }
    });
  }

  initInfiniteData(page: number, size: number) {
    return this.imageService
      .fetchImage(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          imageList: new Array<Image>(data.items.length),
        });
        console.log('Current flag: infite list');
        console.log(this.state.imageList);
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
    this.imageService.fetchImage(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          imageList: this.state.imageList.concat(data.items),
        });
        console.log('Infinite list');
        console.log(this.state.imageList);
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
    this.imageService
      .fetchImage(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          imageList: new Array<Image>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.imageList);
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
    this.imageService
      .filterImageByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          imageList: new Array<Image>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.imageList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterImageByCategory(value, page, size);
      });
  }

  initInfiniteFilterByCategoryData(value: string, page: number, size: number) {
    // this.store.showNotif('Filtered Mode On', 'custom');
    this.setState({ imageList: [] });
    this.store.setIsLoading(true);
    return this.imageService
      .filterImageByCategory(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          imageList: this.state.imageList.concat(data.items),
        });
        console.log('Current flag: infinite filtered list');
        console.log(this.state.imageList);
        this.store.setIsLoading(false);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      });
    // .then(() => {
    //   this.filterImageByCategory(value, page, size);
    // });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.imageService
      .searchImageByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          imageList: new Array<Image>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.imageList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchImageByName(value, page, size);
      });
  }

  initInfiniteSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.imageService
      .searchImageByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            imageList: new Array<Image>(size),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.imageList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchImageByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.imageService
      .sortImageByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          imageList: new Array<Image>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.imageList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortImageByPrice(value, page, size);
      });
  }

  initInfiniteSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.imageService
      .sortImageByPrice(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          imageList: new Array<Image>(size),
        });
        console.log('Current flag: sort list');
        console.log(this.state.imageList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortImageByPrice(value, page, size);
      });
  }

  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.imageService.fetchImage(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          imageList: this.fillEmpty(
            page,
            size,
            this.state.imageList,
            data.items
          ),
        });
        console.log('Pure list');
        console.log(this.state.imageList);
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
    this.imageService.fetchImage(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          imageList: this.fillEmpty(
            page,
            size,
            this.state.imageList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.imageList);
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

  $imageList: Observable<Array<Image>> = this.select(
    (state) => state.imageList
  );

  $exportData: Observable<Array<Image>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedImage: Observable<Object> = this.select(
    (state) => state.selectedImage
  );

  $imageInstance: Observable<Image> = this.select(
    (state) => state.imageInstance
  );

  $isUploadingImage: Observable<boolean> = this.select(
    (state) => state.isUploadingImage
  );

  uploadImage(image: Image, page: number, size: number) {
    this.setIsLoading(true);
    this.setisUploadingImage(true);
    this.imageService.uploadImage(image).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setTotalItems(this.state.totalItems + 1);
        console.log(data);
        this.loadDataAsync(page, size);
        this.getImageBySourceID(image?.sourceID);
        this.setIsLoading(false);
        this.setisUploadingImage(false);
      },
      error: (data: any) => {
        this.setIsLoading(false);
        console.log(data);
      },
    });
  }

  updateImage(image: Image, key: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.imageService.updateImage(image, key).subscribe({
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

  deleteSelectedImages(selectedImages: Array<string>) {
    this.setIsLoading(true);
    return this.imageService.deleteSelectedImages(selectedImages).toPromise();
  }

  deleteAllImages() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.imageService.deleteAllImages().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ imageList: [] });
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

  deleteImage(id: string) {
    this.setIsLoading(true);
    return this.imageService.deleteImage(id).toPromise();
  }

  selectImage(_image: Image) {
    this.setState({ selectedImage: _image });
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

  filterImageByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.imageService
      .filterImageByPrice(criteria, value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            imageList: this.fillEmpty(
              page,
              size,
              this.state.imageList,
              data.items
            ),
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

  filterImageByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.imageService.filterImageByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          imageList: this.fillEmpty(
            page,
            size,
            this.state.imageList,
            data.items
          ),
        });
        console.log('Filtered list');
        console.log(this.state.imageList);
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

  filterInfiniteImageByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.imageService.filterImageByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          imageList: this.state.imageList.concat(data.items),
        });
        console.log('Filtered list');
        console.log(this.state.imageList);
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

  searchImageByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.imageService.searchImageByName(value, page, size).subscribe({
      next: (data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            imageList: this.fillEmpty(
              page,
              size,
              this.state.imageList,
              data.items
            ),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Searched list');
        console.log(this.state.imageList);
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

  searchInfiniteImageByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.imageService.searchImageByName(value, page, size).subscribe({
      next: (data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            imageList: this.state.imageList.concat(data.items),
          });
        } else {
          this.store.showNotif('No result found!', 'custome');
        }
        console.log('Infite searched list');
        console.log(this.state.imageList);
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

  sortImageByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.imageService.sortImageByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          imageList: this.fillEmpty(
            page,
            size,
            this.state.imageList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.imageList);
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

  sortImageByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.imageService.sortImageByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          imageList: this.fillEmpty(
            page,
            size,
            this.state.imageList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.imageList);
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

  sortInfiniteImageByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.imageService.sortImageByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          imageList: this.state.imageList.concat(data.items),
        });
        console.log('Infite sorted list');
        console.log(this.state.imageList);
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

  getImage(id: string) {
    this.setIsLoading(true);
    return this.imageService
      .getImage(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ imageInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  getImageBySourceID(id: string) {
    this.setIsLoading(true);
    return this.imageService
      .getImageBySourceID(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ imageInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  setisUploadingImage(isFetching: boolean) {
    this.setState({ isUploadingImage: isFetching });
  }

  setExportData(array: Array<Image>) {
    this.setState({ imageList: array });
  }
}
