import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { Observable } from 'rxjs';
import { HealthCondition } from '../models/health-condition';
import { User } from '../models/user';
import { NotificationService } from './notification.service';
import { StateService } from './state.service';

interface StoreState {
  userList: Array<User>;
  filteredUserList: Array<User>;
  searchedUserList: Array<User>;
  selectedUser: Object;
  currentUser: Object;
  currentRole: String;
  patientData: HealthCondition;
  isLoading: Boolean;
  notifType: string;
  responseMsg: string;
  lastVisitTime: Date;
}
const initialState: StoreState = {
  userList: [],
  filteredUserList: [],
  searchedUserList: [],
  selectedUser: {},
  currentUser: {},
  currentRole: 'Doctor',
  patientData: {
    bloodPressure: 110,
    sweat: 30,
    bodyTemperature: 33,
    heartRate: 90,
  },
  isLoading: false,
  responseMsg: '',
  notifType: '',
  lastVisitTime: new Date(),
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

  $notifType: Observable<String> = this.select((state) => state.notifType);

  $lastVisitTime: Observable<Date> = this.select(
    (state) => state.lastVisitTime
  );

  $patientData: Observable<HealthCondition> = this.select(
    (state) => state.patientData
  );

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

  setLastVisit(_date: Date) {
    this.setState({ lastVisitTime: _date });
  }

  setPatientData(_patientData: HealthCondition) {
    this.setState({ patientData: _patientData });
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
