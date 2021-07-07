import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Customer } from 'src/app/shared/models/customer';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css'],
})
export class EditUserProfileComponent implements OnInit {
  billDetail$!: Observable<Customer>;
  bloodType: Array<String> = ['A','B','O'];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService
  ) {}

  // getHouse() {
  //   this.billDetail$ = this.route.paramMap.pipe(
  //     switchMap((params: ParamMap) => this.store.getHouse(params.get('id')!))
  //   );
  // }

  // backToHouses() {
  //   this.router.navigate(['houses']);
  // }

  ngOnInit(): void {
    // this.getHouse();
  }
}
