import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { UserHttpService } from './user-http.service';
import { confirm } from 'devextreme/ui/dialog';
interface UserState {
  userList: Array<User>;
  selectedUser: Object;
  userInstance: User;
  exportData: Array<User>;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  responseMsg: String;
  isLoggedIn: Boolean;
}
const initialState: UserState = {
  userList: [],
  selectedUser: {},
  userInstance: undefined,
  exportData: [],
  totalPages: 0,
  currentPage: 0,
  totalItems: 0,
  responseMsg: '',
  isLoggedIn: localStorage.getItem('access_token') !== null,
};
@Injectable({
  providedIn: 'root',
})
export class UserStore extends StateService<UserState> {
  constructor(
    private userService: UserHttpService,
    private store: StoreService
  ) {
    super(initialState);
    // this.initData(0, 5);

    this.$isLoggedIn.subscribe((data: any) => {
      if (data === true) {
        this.store.setCurrentUser(this.parseJwt(this.getToken())._doc);
        this.store.setCurrentUserRole(this.parseJwt(this.getToken())._doc.role);
      }
    });
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
    sourceArray: Array<User>,
    addedArray: Array<User>
  ): Array<User> {
    let result: Array<User> = sourceArray;
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
    this.userService
      .fetchUser(page, size)
      .toPromise()
      .then((data: any) => {
        this.setState({
          userList: new Array<User>(data.totalItems),
        });
        console.log('Current flag: pure list');
        console.log(this.state.userList);
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
    this.userService
      .filterUserByCategory(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          userList: new Array<User>(data.totalItems),
        });
        console.log('Current flag: filtered list');
        console.log(this.state.userList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.filterUserByCategory(value, page, size);
      });
  }

  initSearchByNameData(value: string, page: number, size: number) {
    this.store.showNotif('Searched Mode On', 'custom');
    this.userService
      .searchUserByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          userList: new Array<User>(data.totalItems),
        });
        console.log('Current flag: searched list');
        console.log(this.state.userList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.searchUserByName(value, page, size);
      });
  }

  initSortByPriceData(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.userService
      .sortUserByPrice(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          userList: new Array<User>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.userList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortUserByPrice(value, page, size);
      });
  }

  initSortByName(value: string, page: number, size: number) {
    this.store.showNotif('Sort Mode On', 'custom');
    this.userService
      .sortUserByName(value, 0, 5)
      .toPromise()
      .then((data: any) => {
        this.setState({
          userList: new Array<User>(data.totalItems),
        });
        console.log('Current flag: sort list');
        console.log(this.state.userList);
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
      })
      .then(() => {
        this.sortUserByName(value, page, size);
      });
  }

  loadDataAsync(page: number, size: number) {
    this.setIsLoading(true);
    this.userService.fetchUser(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          userList: this.fillEmpty(page, size, this.state.userList, data.items),
        });
        console.log('Pure list');
        console.log(this.state.userList);
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
    this.userService.fetchUser(page, size).subscribe({
      next: (data: any) => {
        this.setState({
          userList: this.fillEmpty(page, size, this.state.userList, data.items),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Pure list');
        console.log(this.state.userList);
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

  $isLoggedIn: Observable<Boolean> = this.select((state) => state.isLoggedIn);

  $userList: Observable<Array<User>> = this.select((state) => state.userList);

  $exportData: Observable<Array<User>> = this.select(
    (state) => state.exportData
  );

  $totalPages: Observable<Number> = this.select((state) => state.totalPages);

  $totalItems: Observable<Number> = this.select((state) => state.totalItems);

  $currentPage: Observable<Number> = this.select((state) => state.currentPage);

  $selectedUser: Observable<Object> = this.select(
    (state) => state.selectedUser
  );

  $userInstance: Observable<User> = this.select((state) => state.userInstance);

  uploadUser(user: User, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.userService.uploadUser(user).subscribe({
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

  updateUser(user: User, key: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.userService.updateUser(user, key).subscribe({
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

  deleteSelectedUsers(
    selectedUsers: Array<string>,
    page: number,
    size: number
  ) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.userService.deleteSelectedUsers(selectedUsers).subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            console.log(data);
            this.loadDataAsync(page, size);
            console.log(this.state.userList);
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

  deleteAllUsers() {
    this.confirmDialog('Delete all items?').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.userService.deleteAllUsers().subscribe({
          next: (data: any) => {
            this.setState({ responseMsg: data });
            this.setState({ userList: [] });
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

  deleteUser(id: string, page: number, size: number) {
    this.confirmDialog('').then((confirm: boolean) => {
      if (confirm) {
        this.setIsLoading(true);
        this.userService.deleteUser(id).subscribe({
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

  selectUser(_user: User) {
    this.setState({ selectedUser: _user });
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

  getUser(id: string) {
    this.setIsLoading(true);
    return this.userService
      .getUser(id)
      .toPromise()
      .then((data: any) => {
        this.setState({ userInstance: data });
        console.log(data);
        this.setIsLoading(false);
      });
  }

  filterUserByPrice(
    criteria: string,
    value: number,
    page: number,
    size: number
  ) {
    this.setIsLoading(true);
    this.userService.filterUserByPrice(criteria, value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          userList: this.fillEmpty(page, size, this.state.userList, data.items),
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

  filterUserByCategory(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.userService.filterUserByCategory(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          userList: this.fillEmpty(page, size, this.state.userList, data.items),
        });
        console.log('Filtered list');
        console.log(this.state.userList);
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

  searchUserByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.userService.searchUserByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({
          userList: this.fillEmpty(page, size, this.state.userList, data.items),
        });
        console.log('Searched list');
        console.log(this.state.userList);
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

  sortUserByName(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.userService.sortUserByName(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          userList: this.fillEmpty(page, size, this.state.userList, data.items),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.userList);
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

  sortUserByPrice(value: string, page: number, size: number) {
    this.setIsLoading(true);
    this.userService.sortUserByPrice(value, page, size).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.setState({
          userList: this.fillEmpty(page, size, this.state.userList, data.items),
        });
        this.setState({ totalItems: data.totalItems });
        this.setState({ totalPages: data.totalPages });
        this.setState({ currentPage: data.currentPage });
        console.log('Sorted list');
        console.log(this.state.userList);
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

  setExportData(array: Array<User>) {
    this.setState({ userList: array });
  }

  // general obs & functions

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  getToken() {
    // console.log(localStorage.getItem('access_token'));
    return localStorage.getItem('access_token');
  }

  isLoggedIn() {
    let authToken = this.getToken();
    return authToken !== null ? true : false;
  }

  parseJwt(token: any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  loginUser(user: User) {
    this.setIsLoading(true);
    this.userService.loginUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data.message });
        localStorage.setItem('access_token', data.token);
        const parseToken = this.parseJwt(data.token);
        this.store.setCurrentUser(parseToken._doc);
        this.store.setCurrentUserRole(parseToken._doc.role);
        this.setState({ isLoggedIn: true });
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

  logoutUser(user: User) {
    this.setIsLoading(true);
    this.userService.logoutUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.store.setCurrentUser(null);
        this.store.setCurrentUserRole('');
        this.setIsLoading(false);
        localStorage.removeItem('access_token');
        this.setState({ isLoggedIn: false });
        this.store.showNotif(data.message, 'custom');
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }
}
