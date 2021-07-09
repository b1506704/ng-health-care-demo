import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { StateService } from '../state.service';
import { StoreService } from '../store.service';
import { UserHttpService } from './user-http.service';

interface UserState {
  userList: Array<User>;
  filteredUserList: Array<User>;
  searchedUserList: Array<User>;
  selectedUser: Object;
  responseMsg: String;
  isLoggedIn: Boolean;
}
const initialState: UserState = {
  userList: [],
  filteredUserList: [],
  searchedUserList: [],
  selectedUser: {},
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

    this.$isLoggedIn.subscribe((data: any) => {
      if (data === true) {
        this.store.setCurrentUser(this.parseJwt(this.getToken())._doc);
        this.store.setCurrentUserRole(this.parseJwt(this.getToken())._doc.role);
      }
    });
    // this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.userService.fetchUser().subscribe({
      next: (data: any) => {
        this.setState({ userList: data });
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

  setIsLoading(_isLoading: Boolean) {
    this.store.setIsLoading(_isLoading);
  }

  $userList: Observable<Array<User>> = this.select((state) => state.userList);

  $filteredUserList: Observable<Array<User>> = this.select(
    (state) => state.filteredUserList
  );

  $searchedUserList: Observable<Array<User>> = this.select(
    (state) => state.searchedUserList
  );

  $selectedUser: Observable<Object> = this.select(
    (state) => state.selectedUser
  );

  $isLoggedIn: Observable<Boolean> = this.select((state) => state.isLoggedIn);

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
        // console.log(data);
        this.loadDataAsync();
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
        this.store.setCurrentUser({});
        this.store.setCurrentUserRole('');
        this.setIsLoading(false);
        localStorage.removeItem('access_token');
        this.setState({ isLoggedIn: false });
        this.store.showNotif(data.message, 'custom');
        // console.log(data);
        this.loadDataAsync();
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  uploadUser(user: User) {
    this.setIsLoading(true);
    this.userService.uploadUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
        this.setIsLoading(false);
        this.loadDataAsync();
        this.store.showNotif(data.message, 'custom');
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  updateUser(user: User) {
    this.setIsLoading(true);
    this.userService.updateUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
        this.setIsLoading(false);
        this.store.showNotif(data.message, 'custom');
        this.loadDataAsync();
      },
      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  deleteUser(user: User) {
    this.setIsLoading(true);
    this.userService.deleteUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
        this.setIsLoading(false);
        this.store.showNotif(data.message, 'custom');
        this.loadDataAsync();
      },

      error: (data: any) => {
        this.setIsLoading(false);
        this.store.showNotif(data.error.errorMessage, 'error');
        console.log(data);
      },
    });
  }

  selectUser(_user: User) {
    this.setState({ selectedUser: _user });
  }

  getUser(userName: string | number) {
    return this.$userList.pipe(
      map(
        (users: Array<User>) =>
          users.find((user) => user.userName === userName)!
      )
    );
  }
  // need rework
  filterUser(_userList: Array<User>, _criteria: string) {
    this.setState({ filteredUserList: _userList });
  }
  // need rework
  searchUser(_userList: Array<User>, _criteria: string) {
    this.setState({ searchedUserList: _userList });
  }
}
