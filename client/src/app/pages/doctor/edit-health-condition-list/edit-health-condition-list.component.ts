import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HealthCondition } from 'src/app/shared/models/health-condition';
import { Room } from 'src/app/shared/models/room';
import { RoomStore } from 'src/app/shared/services/room/room-store.service';

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
  currentCustomer: Object;
  roomID: string;
  patientStatus: string = 'Healthy';
  customizeText(arg: any) {
    return arg.valueText + ' BPM';
  }

  constructor(
    // private store: StoreService,
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

  listSelectionChanged = (e: any) => {
    console.log('SELECTED CUSTOMER');
    console.log(e.addedItems[0]);
    this.currentCustomer = e.addedItems[0];
    this.router.navigate(['condition', e.addedItems[0].id], {
      relativeTo: this.route,
    });
  };

  ngOnInit(): void {
    this.getRoomID();
  }

  ngOnDestroy(): void {
    this.getRoomID().unsubscribe();
  }
}
