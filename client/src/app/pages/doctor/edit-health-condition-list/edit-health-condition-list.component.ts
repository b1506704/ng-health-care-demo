import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  Router,
  RouteReuseStrategy,
} from '@angular/router';
import { HealthCondition } from 'src/app/shared/models/health-condition';
import { Room } from 'src/app/shared/models/room';
import { RoomStore } from 'src/app/shared/services/room/room-store.service';

export class CustomReuseStrategy extends RouteReuseStrategy {
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    if (future.routeConfig === curr.routeConfig) {
      return !future.data.alwaysRefresh;
    } else {
      return false;
    }
  }

  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null
  ): void {}
}

@Component({
  selector: 'app-edit-health-condition-list',
  templateUrl: './edit-health-condition-list.component.html',
  styleUrls: ['./edit-health-condition-list.component.scss'],
})
export class EditHealthConditionListComponent implements OnInit, OnDestroy {
  visualRange: Object = {};
  patientData!: HealthCondition;
  randomInterval: any;
  roomDetail: Room;
  customerList: Array<Object>;
  currentCustomer: any;
  roomID: string;
  patientStatus: string = 'Healthy';
  customizeText(arg: any) {
    return arg.valueText + ' BPM';
  }

  constructor(
    private roomStore: RoomStore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getRoomID() {
    return this.route.paramMap.subscribe((param) => {
      this.roomID = param.get('id');
      this.roomStore.getRoom(param.get('id')).then(() => {
        this.roomStore.$roomInstance.subscribe((data: any) => {
          this.roomDetail = data;
          this.customerList = data.customerID;
          console.log(data);
        });
      });
      console.log(param.get('id'));
    });
  }

  onDeactivate(e: any) {
    console.log(e);
    // this.currentCustomer = null;
  }

  listSelectionChanged = (e: any) => {
    console.log('SELECTED CUSTOMER');
    console.log(e.addedItems);

    this.currentCustomer = e.addedItems[0];
    this.router.navigate([{ outlets: { conditionOutlet: null } }]);
    const outlet = {
      outlets: { conditionOutlet: ['condition', this.currentCustomer._id] },
    };
    this.router.navigate([outlet], { relativeTo: this.route.parent });
  };

  navigateToRoom() {
    this.router.navigate(['/room_monitor']);
  }

  navigateToSchedule() {
    this.router.navigate(['/schedule_list']);
  }

  ngOnInit(): void {
    this.getRoomID();
  }

  ngOnDestroy(): void {
    this.getRoomID().unsubscribe();
  }
}
