import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/shared/models/customer';
import { HealthCondition } from 'src/app/shared/models/health-condition';
import { Socket } from 'ngx-socket-io';
import { BedCondition } from 'src/app/shared/models/bed-condition';
@Component({
  selector: 'app-condition-detail',
  templateUrl: './condition-detail.component.html',
  styleUrls: ['./condition-detail.component.scss'],
})
export class ConditionDetailComponent implements OnInit {
  visualRange: Object = {};
  patientData!: any;
  patientID: String;
  randomInterval: any;
  currentPatient: Customer;
  patientStatus: string = 'Healthy';
  currentCondition = this.socket.fromEvent<any>('condition');
  // currentDevice = this.socket.fromEvent<Object>('device');
  // devices = this.socket.fromEvent<Array<Object>>('devices');
  conditions = this.socket.fromEvent<Array<any>>('conditions');

  customizeText(arg: any) {
    return arg.valueText + ' BPM';
  }

  constructor(private socket: Socket, private route: ActivatedRoute) {}

  getCondition(id: string) {
    this.socket.emit('getCondition', id);
  }

  getDevice(id: string) {
    this.socket.emit('getDevice', id);
  }

  newCondition() {
    this.socket.emit('newCondition', { id: this.patientID, condition: '' });
  }

  // newDevice() {
  //   this.socket.emit('newDevice', { id: this.patientID, device: {} });
  // }

  editCondition(condition: HealthCondition) {
    this.socket.emit('editCondition', condition);
  }

  // editDevice(device: BedCondition) {
  //   this.socket.emit('editDevice', device);
  // }

  getPatientID() {
    return this.route.paramMap.subscribe((param) => {
      this.patientID = param.get('id');
      this.newCondition();
      // this.newDevice();
      this.getCondition(param.get('id'));
      // this.getDevice(param.get('id'));
    });
  }

  pmPatient() {}

  alertPatient() {}

  summonPatient() {}

  ngOnInit(): void {
    this.getPatientID();
    this.currentCondition.subscribe((data: any) => {
      console.log('CURRENT EMITTED DATA');
      console.log(data);
      if (data.condition) {
        this.patientData = data.condition;
      }
    });
    this.conditions.subscribe((data: any) => {
      console.log('TOTAL CONNECTED PATIENT');
      console.log(data);
    });
  }
}
