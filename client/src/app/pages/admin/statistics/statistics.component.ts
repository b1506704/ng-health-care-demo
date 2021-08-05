import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerStore } from 'src/app/shared/services/customer/customer-store.service';
import { DoctorStore } from 'src/app/shared/services/doctor/doctor-store.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  pageSize: number = 50;
  currentIndexFromServer: number;

  constructor(
    private customerStore: CustomerStore,
    private doctorStore: DoctorStore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  loadMoreData() {
    this.customerStore.loadDataAsync(
      this.currentIndexFromServer + 1,
      this.pageSize
    );
    this.doctorStore.loadDataAsync(
      this.currentIndexFromServer + 1,
      this.pageSize
    );
  }

  toCustomer() {
    this.router.navigate(['customer'], { relativeTo: this.route });
  }

  toDoctor() {
    this.router.navigate(['doctor'], { relativeTo: this.route });
  }

  navigateToEditUser() {
    this.router.navigate(['/edit_user_list']);
  }
  
  currentPageListener() {
    return this.customerStore.$currentPage.subscribe((data: any) => {
      this.currentIndexFromServer = data;
    });
  }

  ngOnInit(): void {
    this.currentPageListener();
  }

  ngOnDestroy(): void {
    this.currentPageListener().unsubscribe();
  }
}
