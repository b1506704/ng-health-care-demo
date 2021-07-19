import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Customer } from 'src/app/shared/models/customer';
import { HealthCondition } from 'src/app/shared/models/health-condition';
import { Room } from 'src/app/shared/models/room';
import { RoomStore } from 'src/app/shared/services/room/room-store.service';
import { StoreService } from 'src/app/shared/services/store.service';
import random from '../../../../utils/RandomNumber';

@Component({
  selector: 'app-condition-detail',
  templateUrl: './condition-detail.component.html',
  styleUrls: ['./condition-detail.component.scss'],
})
export class ConditionDetailComponent implements OnInit, OnDestroy {
  visualRange: Object = {};
  patientData!: HealthCondition;
  randomInterval: any;

  patientStatus: string = 'Healthy';
  customizeText(arg: any) {
    return arg.valueText + ' BPM';
  }

  constructor(
    private store: StoreService,
    private roomStore: RoomStore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  patientDataListener() {
    return this.store.$patientData.subscribe((data: any) => {
      if (data.heartRate >= 180) {
        this.patientStatus = 'CRITICAL';
      } else if (data.heartRate >= 110) {
        this.patientStatus = 'NORMAL';
      } else if (data.heartRate >= 60) {
        this.patientStatus = 'HEALTHY';
      } else if (data.heartRate >= 20) {
        this.patientStatus = 'DYING';
      } else if (data.heartRate === 0) {
        this.patientStatus = 'DEAD';
      }
      this.patientData = data;
    });
  }

  // getRoom() {
  //   this.roomDetail$ = this.route.paramMap.pipe(
  //     switchMap((params: ParamMap) =>
  //       this.roomStore.getRoom(params.get('_id')!)
  //     )
  //   );
  // }

  ngOnInit(): void {
    this.randomInterval = setInterval(() => {
      const patientData = {
        bloodPressure: random(70, 200),
        sweat: random(1, 100),
        bodyTemperature: random(10, 90),
        heartRate: random(0, 210),
      };
      this.store.setPatientData(patientData);
    }, 1200);
    this.patientDataListener();
  }

  ngOnDestroy(): void {
    this.patientDataListener().unsubscribe();
    clearInterval(this.randomInterval);
  }
}
