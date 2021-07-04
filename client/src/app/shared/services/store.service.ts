import { Injectable } from '@angular/core';
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
  patientData: HealthCondition;
  isLoading: Boolean;
  isNotifVisible: Boolean;
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
  patientData: {
    bloodPressure: 110,
    sweat: 30,
    bodyTemperature: 33,
    heartRate: 90,
  },
  isLoading: false,
  isNotifVisible: false,
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

  $isNotifVisible: Observable<Boolean> = this.select(
    (state) => state.isNotifVisible
  );

  $responseMsg: Observable<String> = this.select((state) => state.responseMsg);

  $notifType: Observable<String> = this.select((state) => state.notifType);

  $lastVisitTime: Observable<Date> = this.select(
    (state) => state.lastVisitTime
  );

  $patientData: Observable<HealthCondition> = this.select(
    (state) => state.patientData
  );

  loadDataAsync() {}

  setIsLoading(_isLoading: Boolean) {
    this.setState({ isLoading: _isLoading });
  }

  setIsNotifVisible(_isVisible: Boolean) {
    this.setState({ isNotifVisible: _isVisible });
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

  showNotifSuccess(message: string, type: string) {
    this.setIsNotifVisible(true);
    this.setNotifType(type);
    this.setResponseMsg(message);
  }

  setPatientData(_patientData: HealthCondition) {
    this.setState({ patientData: _patientData });
  }
}
