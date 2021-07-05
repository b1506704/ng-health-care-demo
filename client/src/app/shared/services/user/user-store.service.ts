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
}
const initialState: UserState = {
  userList: [],
  filteredUserList: [],
  searchedUserList: [],
  selectedUser: {},
  responseMsg: '',
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
    this.loadDataAsync();
  }

  // general obs & functions

  loadDataAsync() {
    this.setIsLoading(true);
    this.userService.fetchUser().subscribe({
      next: (data: any) => {
        this.setState({ userList: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
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

  loginUser(user: User) {
    this.setIsLoading(true);
    this.userService.loginUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.store.setCurrentUser(data);
        this.store.setCurrentUserRole(data.role);
        this.loadDataAsync();
        this.setIsLoading(false);
        this.store.showNotifSuccess('Login successfully', 'custom');
        console.log(data);
      },
    });
  }

  logoutUser(user: User) {
    this.setIsLoading(true);
    this.userService.loginUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        this.store.setCurrentUser(data);
        console.log(data);
      },
      complete: () => {
        this.loadDataAsync();
        this.setIsLoading(false);
        this.store.showNotifSuccess('Signup successfully', 'custom');
      },
    });
  }

  uploadUser(user: User) {
    this.setIsLoading(true);
    this.userService.uploadUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
        this.store.showNotifSuccess('Signup successfully', 'custom');
      },
    });
  }

  updateUser(user: User) {
    this.setIsLoading(true);
    this.userService.updateUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
      },
    });
  }

  deleteUser(user: User) {
    this.setIsLoading(true);
    this.userService.deleteUser(user).subscribe({
      next: (data: any) => {
        this.setState({ responseMsg: data });
        console.log(data);
      },
      complete: () => {
        this.setIsLoading(false);
        this.loadDataAsync();
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

  filterUser(_userList: Array<User>, _criteria: string) {
    this.setState({ filteredUserList: _userList });
  }

  searchUser(_userList: Array<User>, _criteria: string) {
    this.setState({ searchedUserList: _userList });
  }
}
