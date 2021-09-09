import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { NotificationService } from './notification.service';
import { StateService } from './state.service';

interface StoreState {
  userList: Array<User>;
  selectedUser: Object;
  currentUser: Object;
  currentRole: String;
  responseList: Array<Object>;
  responseEventType: string;
  responseProgress: number;
  isLoading: Boolean;
  notifType: string;
  responseMsg: string;
}
const initialState: StoreState = {
  userList: [],
  responseList: [],
  responseProgress: undefined,
  responseEventType: undefined,
  selectedUser: {},
  currentUser: {},
  currentRole: '',
  isLoading: false,
  responseMsg: '',
  notifType: '',
};
@Injectable({
  providedIn: 'root',
})
export class StoreService extends StateService<StoreState> {
  constructor(private notifService: NotificationService) {
    super(initialState);
    this.loadDataAsync();
  }

  $isLoading: Observable<Boolean> = this.select((state) => state.isLoading);

  $responseMsg: Observable<String> = this.select((state) => state.responseMsg);

  $responseList: Observable<Object> = this.select(
    (state) => state.responseList
  );

  $responseProgress: Observable<number> = this.select(
    (state) => state.responseProgress
  );

  $responseEventType: Observable<string> = this.select(
    (state) => state.responseEventType
  );

  $notifType: Observable<String> = this.select((state) => state.notifType);

  $currentUser: Observable<Object> = this.select((state) => state.currentUser);

  $currentRole: Observable<String> = this.select((state) => state.currentRole);

  loadDataAsync() {}

  setIsLoading(_isLoading: Boolean) {
    this.setState({ isLoading: _isLoading });
  }

  setResponseMsg(message: string) {
    this.setState({ responseMsg: message });
  }

  setNotifType(type: string) {
    this.setState({ notifType: type });
  }

  setResponseProgress(progress: number) {
    this.setState({ responseProgress: progress });
  }

  setResponseEventType(eventType: string) {
    this.setState({ responseEventType: eventType });
  }
  //todo: manage response progress array

  addResponse(response: Object) {
    this.setState({ responseList: this.state.responseList.concat(response) });
  }

  removeResponse(id: any) {
    this.setState({
      responseList: this.state.responseList.filter((e: any) => e?.id === id),
    });
  }

  setCurrentUser(_user: Object) {
    this.setState({ currentUser: _user });
  }

  setCurrentUserRole(role: String) {
    this.setState({ currentRole: role });
  }

  showNotif(message: string, type: string) {
    notify({ message: message, width: 150 }, type);
    this.setResponseMsg(message);
  }
}
