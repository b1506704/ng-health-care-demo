import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Disease } from '../../models/disease';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { DiseaseHttpService } from './disease-http.service';
import { confirm } from 'devextreme/ui/dialog';

interface DiseaseState {
  diseaseList: Array<Disease>;
  exportData: Array<Disease>;
  selectedDisease: Object;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: DiseaseState = {
  diseaseList: [],
  selectedDisease: {},
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class DiseaseStore extends StateService<DiseaseState> {
  constructor(
    private diseaseService: DiseaseHttpService,
    private store: StoreService
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
    sourceArray: Array<Disease>,
    addedArray: Array<Disease>
  ): Array<Disease> {
    let result: Array<Disease> = sourceArray;
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

  initData(page: number, size: number) {
    this.diseaseService
      .fetchDisease(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          diseaseList: new Array<Disease>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.diseaseList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.loadDataAsync(page, size);
      });
  }

  initInfiniteData(page: number, size: number) {
    return this.diseaseService
      .fetchDisease(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          diseaseList: new Array<Disease>(data.items.length),
        });

        console.log('Current flag: infite list');
        console.log(this.state.diseaseList);
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
    this.diseaseService.fetchDisease(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          diseaseList: this.state.diseaseList.concat(data.items),
        });
        console.log('Infinite list');
        console.log(this.state.diseaseList);
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

  initFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.diseaseService
      .filterDiseaseByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          diseaseList: new Array<Disease>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.diseaseList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterDiseaseByCategory(value, page, size);
      });
  }

  initInfiniteFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.diseaseService
      .filterDiseaseByCategory(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          diseaseList: new Array<Disease>(data.items.length),
        });
        console.log('Current flag: infinite filtered list');
        console.log(this.state.diseaseList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterDiseaseByCategory(value, page, size);
      });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.diseaseService
      .searchDiseaseByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          diseaseList: new Array<Disease>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.diseaseList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchDiseaseByName(value, page, size);
      });
  }

  initInfiniteSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.diseaseService
      .searchDiseaseByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            diseaseList: new Array<Disease>(data.items.length),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.diseaseList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchDiseaseByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.diseaseService
      .sortDiseaseByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          diseaseList: new Array<Disease>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.diseaseList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortDiseaseByPrice(value, page, size);
      });
  }

  initSortByName(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.diseaseService
      .sortDiseaseByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          diseaseList: new Array<Disease>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.diseaseList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortDiseaseByName(value, page, size);
      });
  }

  initInfiniteSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.diseaseService
      .sortDiseaseByPrice(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          diseaseList: new Array<Disease>(data.items.length),
        });
        console.log('Current flag: sort list');
        console.log(this.state.diseaseList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortDiseaseByPrice(value, page, size);
      });
  }

  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.diseaseService.fetchDisease(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          diseaseList: this.fillEmpty(
            page,
            size,
            this.state.diseaseList,
            data.items
          ),
        });
        console.log('Pure list');
        console.log(this.state.diseaseList);
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
    this.diseaseService.fetchDisease(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          diseaseList: this.fillEmpty(
            page,
            size,
            this.state.diseaseList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.diseaseList);
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

  $diseaseList: Observable<Array<Disease>> = this.select(
    (state) => state.diseaseList
  );

  $exportData: Observable<Array<Disease>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedDisease: Observable<Object> = this.select(
    (state) => state.selectedDisease
  );

  uploadDisease(disease: Disease, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.diseaseService.uploadDisease(disease).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setTotalItems(this.state.totalItems + 1);
            console.log(data);
            this.loadDataAsync(page, size);
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

  updateDisease(disease: Disease, key: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.diseaseService.updateDisease(disease, key).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.loadDataAsync(page, size);
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

  deleteSelectedDiseases(
    selectedDiseases: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.diseaseService.deleteSelectedDiseases(selectedDiseases).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.loadDataAsync(page, size);
            console.log(this.state.diseaseList);
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

  deleteAllDiseases() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.diseaseService.deleteAllDiseases().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ diseaseList: [] });
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

  deleteDisease(id: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.diseaseService.deleteDisease(id).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setTotalItems(this.state.totalItems - 1);
            console.log(data);
            this.loadDataAsync(page, size);
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

  selectDisease(_disease: Disease) {
    this.setState({ selectedDisease: _disease });
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

  getDisease(id: string | number) {
    return this.$diseaseList.pipe(
      map(
        (diseases: Array<Disease>) =>
          diseases.find((disease) => disease._id === id)!
      )
    );
  }

  filterDiseaseByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.diseaseService
      .filterDiseaseByPrice(criteria, value, page, size)
      .subscribe({
        next: (data: any) => {
          this.setState({ responseMsg: data });
          this.setState({
            diseaseList: this.fillEmpty(
              page,
              size,
              this.state.diseaseList,
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

  filterDiseaseByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.diseaseService.filterDiseaseByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          diseaseList: this.fillEmpty(
            page,
            size,
            this.state.diseaseList,
            data.items
          ),
        });
        console.log('Filtered list');
        console.log(this.state.diseaseList);
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

  filterInfiniteDiseaseByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.diseaseService.filterDiseaseByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          diseaseList: this.state.diseaseList.concat(data.items),
        });
        console.log('Filtered list');
        console.log(this.state.diseaseList);
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

  searchDiseaseByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.diseaseService.searchDiseaseByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          diseaseList: this.fillEmpty(
            page,
            size,
            this.state.diseaseList,
            data.items
          ),
        });
        console.log('Searched list');
        console.log(this.state.diseaseList);
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

  searchInfiniteDiseaseByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.diseaseService.searchDiseaseByName(value, page, size).subscribe({
      next: (data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            diseaseList: this.state.diseaseList.concat(data.items),
          });
        } else {
          this.store.showNotif('No result found!', 'custome');
        }
        console.log('Infite searched list');
        console.log(this.state.diseaseList);
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

  sortDiseaseByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.diseaseService.sortDiseaseByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          diseaseList: this.fillEmpty(
            page,
            size,
            this.state.diseaseList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.diseaseList);
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

  sortDiseaseByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.diseaseService.sortDiseaseByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          diseaseList: this.fillEmpty(
            page,
            size,
            this.state.diseaseList,
            data.items
          ),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.diseaseList);
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

  sortInfiniteDiseaseByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.diseaseService.sortDiseaseByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          diseaseList: this.state.diseaseList.concat(data.items),
        });
        console.log('Infite sorted list');
        console.log(this.state.diseaseList);
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

  setExportData(array: Array<Disease>) {
    this.setState({ diseaseList: array });
  }
}
