import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
  constructor() {}

  public get title() {
    return 'Tesla Clinic';
  }

  public get currentYear() {
    return new Date().getFullYear();
  }
}
