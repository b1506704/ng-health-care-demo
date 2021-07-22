import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/shared/models/customer';
import { HealthCondition } from 'src/app/shared/models/health-condition';
import { Socket } from 'ngx-socket-io';
import { BedCondition } from 'src/app/shared/models/bed-condition';
import { CustomerStore } from 'src/app/shared/services/customer/customer-store.service';
import random from 'src/app/utils/RandomNumber';
import { StoreService } from 'src/app/shared/services/store.service';
@Component({
  selector: 'app-condition-detail',
  templateUrl: './condition-detail.component.html',
  styleUrls: ['./condition-detail.component.scss'],
})
export class ConditionDetailComponent implements OnInit, OnDestroy {
  visualRange: Object = {};
  patientData!: any;
  patientID: string;
  customerData: Customer;
  stethoscopeSwitch: Boolean = true;
  thermometerSwitch: Boolean = true;
  co2Switch: Boolean = true;
  aneroidSwitch: Boolean = true;
  patientStatus: string = 'Healthy';
  patientDataInterval: any;
  co2Interval: any;
  stethoscopeInterval: any;
  aneroidInterval: any;
  thermometerInterval: any;
  currentCondition = this.socket.fromEvent<any>('condition');
  conditions = this.socket.fromEvent<Array<any>>('conditions');

  customizeText(arg: any) {
    return arg.valueText + ' BPM';
  }

  constructor(
    private socket: Socket,
    private route: ActivatedRoute,
    private customerStore: CustomerStore,
    private store: StoreService
  ) {}

  getCondition(id: string) {
    this.socket.emit('getCondition', id);
  }

  getDevice(id: string) {
    this.socket.emit('getDevice', id);
  }

  newCondition() {
    this.socket.emit('newCondition', { id: this.patientID, condition: '' });
  }

  editCondition(condition: Object) {
    this.socket.emit('editCondition', condition);
  }

  getPatientID() {
    return this.route.paramMap.subscribe((param) => {
      this.patientID = param.get('id');
      this.customerStore.getCustomer(param.get('id')).then(() => {
        this.customerStore.$customerInstance.subscribe((data: any) => {
          this.customerData = data;
          console.log(data);
        });
      });
    });
  }

  pmPatient() {}

  disconnect() {
    this.socket.removeListener('condition', this.getCondition);
    clearInterval(this.patientDataInterval);
    clearInterval(this.stethoscopeInterval);
    clearInterval(this.co2Interval);
    clearInterval(this.thermometerInterval);
    clearInterval(this.aneroidInterval);
  }

  summonPatient() {}

  co2SwitchListener(e: any) {
    this.co2Switch = e.value;
    if (e.value === true) {
      this.store.showNotif('CO2 POWER ON', 'custom');
    } else {
      this.store.showNotif('CO2 POWER OFF', 'custom');
    }
    this.co2Socket();
  }

  co2Socket() {
    if (this.co2Switch === true) {
      this.co2Interval = setInterval(() => {
        this.socket.emit('co2', true);
      }, 1500);
    } else {
      clearInterval(this.co2Interval);
      this.socket.emit('co2', false);
    }
  }

  stethoscopeSwitchListener(e: any) {
    this.stethoscopeSwitch = e.value;
    if (e.value === true) {
      this.store.showNotif('STETHOSCOPE POWER ON', 'custom');
    } else {
      this.store.showNotif('STETHOSCOPE POWER OFF', 'custom');
    }
    this.stethoscopeSocket();
  }

  stethoscopeSocket() {
    if (this.stethoscopeSwitch === true) {
      this.stethoscopeInterval = setInterval(() => {
        this.socket.emit('stethoscope', true);
      }, 1500);
    } else {
      clearInterval(this.stethoscopeInterval);
      this.socket.emit('stethoscope', false);
    }
  }

  thermometerSwitchListener(e: any) {
    this.thermometerSwitch = e.value;
    if (e.value === true) {
      this.store.showNotif('THERMOMETER POWER ON', 'custom');
    } else {
      this.store.showNotif('THERMOMETER POWER OFF', 'custom');
    }
    this.thermometerSocket();
  }

  thermometerSocket() {
    if (this.thermometerSwitch === true) {
      this.thermometerInterval = setInterval(() => {
        this.socket.emit('thermometer', true);
      }, 1500);
    } else {
      clearInterval(this.thermometerInterval);
      this.socket.emit('thermometer', false);
    }
  }

  aneroidSwitchListener(e: any) {
    this.aneroidSwitch = e.value;
    if (e.value === true) {
      this.store.showNotif('ANEROID POWER ON', 'custom');
    } else {
      this.store.showNotif('ANEROID POWER OFF', 'custom');
    }
    this.aneroidSocket();
  }

  aneroidSocket() {
    if (this.aneroidSwitch === true) {
      this.aneroidInterval = setInterval(() => {
        this.socket.emit('aneroid', true);
      }, 1500);
    } else {
      clearInterval(this.aneroidInterval);
      this.socket.emit('aneroid', false);
    }
  }

  patientDataListener() {
    return this.currentCondition.subscribe((data: any) => {
      console.log('CURRENT EMITTED DATA');
      console.log(data);
      if (data.condition) {
        this.patientData = data.condition;
      }
    });
  }

  patientListListener() {
    return this.conditions.subscribe((data: any) => {
      console.log('TOTAL CONNECTED PATIENT');
      console.log(data);
    });
  }

  ngOnInit(): void {
    this.getPatientID();
    this.newCondition();
    this.patientDataInterval = setInterval(() => {
      this.getCondition(this.patientID);
    }, 1500);
    this.co2Socket();
    this.thermometerSocket();
    this.aneroidSocket();
    this.stethoscopeSocket();
    this.patientDataListener();
    this.patientListListener();
  }

  ngOnDestroy(): void {
    this.getPatientID().unsubscribe();
    this.patientDataListener().unsubscribe();
    this.patientListListener().unsubscribe();
    this.disconnect();
  }
}
