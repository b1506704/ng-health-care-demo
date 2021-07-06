import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StoreService } from './store.service';
import { UserStore } from './user/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    public userStoreService: UserStore,
    public router: Router,
    private store: StoreService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.userStoreService.$isLoggedIn.subscribe((data: any) => {
      if (data !== true) {
        this.store.showNotif('Please log in first!', 'custom');
        this.router.navigate(['/login']);
      }
    });
    return true;
  }
}
