import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserStore } from './user/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserStore) {}
  sendLoginRequest(user: User) {
    this.userService.loginUser(user);
  }
  sendRegisterRequest(user: User) {
    this.userService.uploadUser(user, 0, 5);
  }
}
