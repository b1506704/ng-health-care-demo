import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification: Array<any> = [];
  constructor() { }

  showNotif(inputElement: string | TemplateRef<any>, options: Object) {
    this.notification.push({inputElement, ...options});
  } 
  removeNotif(notif: any) {
    this.notification = this.notification.filter((n) => n !== notif);
  }
}
