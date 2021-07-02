import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Bill } from 'src/app/shared/models/bill';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.css'],
})
export class BillDetailComponent implements OnInit {
  billDetail$!: Observable<Bill>;
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
