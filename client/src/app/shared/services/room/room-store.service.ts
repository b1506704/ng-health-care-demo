import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room } from '../../models/room';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { RoomHttpService } from './room-http.service';
import { confirm } from 'devextreme/ui/dialog';

interface RoomState {
  roomList: Array<Room>;
  exportData: Array<Room>;
  roomInstance: Room;
  selectedRoom: Object;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
}
const initialState: RoomState = {
  roomList: [],
  selectedRoom: {},
  roomInstance: undefined,
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
  responseMsg: '',
};
@Injectable({
  providedIn: 'root',
})
export class RoomStore extends StateService<RoomState> {
  constructor(
    private roomService: RoomHttpService,
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
    sourceArray: Array<Room>,
    addedArray: Array<Room>
  ): Array<Room> {
    let result: Array<Room> = sourceArray;
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
    this.roomService
      .fetchRoom(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          roomList: new Array<Room>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.roomList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.loadDataAsync(page, size);
      });
  }

  initInfiniteData(page: number, size: number) {
    return this.roomService
      .fetchRoom(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          roomList: new Array<Room>(data.items.length),
        });
        console.log('Current flag: infite list');
        console.log(this.state.roomList);
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
    this.roomService.fetchRoom(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          roomList: this.state.roomList.concat(data.items),
        });
        console.log('Infinite list');
        console.log(this.state.roomList);
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
    this.roomService
      .filterRoomByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          roomList: new Array<Room>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.roomList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterRoomByCategory(value, page, size);
      });
  }

  initInfiniteFilterByCategoryData(value: string, page: number, size: number) {
    this.store.showNotif('Filtered Mode On', 'custom');
    this.roomService
      .filterRoomByCategory(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          roomList: new Array<Room>(data.items.length),
        });
        console.log('Current flag: infinite filtered list');
        console.log(this.state.roomList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterRoomByCategory(value, page, size);
      });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.roomService
      .searchRoomByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          roomList: new Array<Room>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.roomList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchRoomByName(value, page, size);
      });
  }

  initInfiniteSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.roomService
      .searchRoomByName(value, page, size)
      .toPromise()
      .then((data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            roomList: new Array<Room>(data.items.length),
          });
        } else {
          this.store.showNotif('No result found!', 'custom');
        }
        console.log('Current flag: infitite searched list');
        console.log(this.state.roomList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchRoomByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.roomService
      .sortRoomByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          roomList: new Array<Room>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.roomList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortRoomByPrice(value, page, size);
      });
  }

  initInfiniteSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.roomService
      .sortRoomByPrice(value, page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          roomList: new Array<Room>(data.items.length),
        });
        console.log('Current flag: sort list');
        console.log(this.state.roomList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortRoomByPrice(value, page, size);
      });
  }

  initSortByName(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.roomService
      .sortRoomByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          roomList: new Array<Room>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.roomList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortRoomByName(value, page, size);
      });
  }

  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.roomService.fetchRoom(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          roomList: this.fillEmpty(page, size, this.state.roomList, data.items),
        });
        console.log('Pure list');
        console.log(this.state.roomList);
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
    this.roomService.fetchRoom(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          roomList: this.fillEmpty(page, size, this.state.roomList, data.items),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.roomList);
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

  $roomList: Observable<Array<Room>> = this.select((state) => state.roomList);

  $exportData: Observable<Array<Room>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedRoom: Observable<Object> = this.select(
    (state) => state.selectedRoom
  );

  $roomInstance: Observable<Room> = this.select((state) => state.roomInstance);

  uploadRoom(room: Room, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.roomService.uploadRoom(room).subscribe({
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

  updateRoom(room: Room, key: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.roomService.updateRoom(room, key).subscribe({
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

  deleteSelectedRooms(
    selectedRooms: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.roomService.deleteSelectedRooms(selectedRooms).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.loadDataAsync(page, size);
            console.log(this.state.roomList);
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

  deleteAllRooms() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.roomService.deleteAllRooms().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ roomList: [] });
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

  deleteRoom(id: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.roomService.deleteRoom(id).subscribe({
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

  selectRoom(_room: Room) {
    this.setState({ selectedRoom: _room });
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

  getRoom(id: string) {
    this.setIsLoading(true);
    return this.roomService
      .getRoom(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ roomInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  filterRoomByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.roomService.filterRoomByPrice(criteria, value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          roomList: this.fillEmpty(page, size, this.state.roomList, data.items),
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

  filterRoomByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.roomService.filterRoomByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          roomList: this.fillEmpty(page, size, this.state.roomList, data.items),
        });
        console.log('Filtered list');
        console.log(this.state.roomList);
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

  filterInfiniteRoomByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.roomService.filterRoomByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          roomList: this.state.roomList.concat(data.items),
        });
        console.log('Filtered list');
        console.log(this.state.roomList);
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

  searchRoomByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.roomService.searchRoomByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          roomList: this.fillEmpty(page, size, this.state.roomList, data.items),
        });
        console.log('Searched list');
        console.log(this.state.roomList);
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

  searchInfiniteRoomByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.roomService.searchRoomByName(value, page, size).subscribe({
      next: (data: any) => {
        if (data.totalItems !== 0) {
          this.setState({
            roomList: this.state.roomList.concat(data.items),
          });
        } else {
          this.store.showNotif('No result found!', 'custome');
        }
        console.log('Infite searched list');
        console.log(this.state.roomList);
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

  sortRoomByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.roomService.sortRoomByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          roomList: this.fillEmpty(page, size, this.state.roomList, data.items),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.roomList);
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

  sortInfiniteRoomByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.roomService.sortRoomByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          roomList: this.state.roomList.concat(data.items),
        });
        console.log('Infite sorted list');
        console.log(this.state.roomList);
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

  sortRoomByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.roomService.sortRoomByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          roomList: this.fillEmpty(page, size, this.state.roomList, data.items),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.roomList);
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

  setExportData(array: Array<Room>) {
    this.setState({ roomList: array });
  }
}
