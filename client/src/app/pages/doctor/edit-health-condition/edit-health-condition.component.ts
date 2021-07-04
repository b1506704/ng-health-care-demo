import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/shared/models/customer';
import { HealthCondition } from 'src/app/shared/models/health-condition';
import { StoreService } from 'src/app/shared/services/store.service';
import random from '../../../utils/RandomNumber';

@Component({
  selector: 'app-edit-health-condition',
  templateUrl: './edit-health-condition.component.html',
  styleUrls: ['./edit-health-condition.component.scss'],
})
export class EditHealthConditionComponent implements OnInit, OnDestroy {
  visualRange: Object = {};
  patientData!: HealthCondition;
  randomInterval: any;

  patientStatus: string = 'Healthy';
  patientList: Array<Customer> = [
    {
      userName: 'test1',
      fullName: 'Test 1',
      age: 25,
      gender: 'Male',
      occupation: 'Software Engineer',
      address: 'Xuan Khanh, Ninh Kieu, Can Tho',
      bloodType: 'B',
    },
    {
      userName: 'test2',
      fullName: 'Test 2',
      age: 21,
      gender: 'Male',
      occupation: 'Software Engineer',
      address: 'Xuan Khanh, Ninh Kieu, Can Tho',
      bloodType: 'A',
    },
    {
      userName: 'test3',
      fullName: 'Test 3',
      age: 45,
      gender: 'Female',
      occupation: 'Software Engineer',
      address: 'Xuan Khanh, Ninh Kieu, Can Tho',
      bloodType: 'O',
    },
    {
      userName: 'test4',
      fullName: 'Test 4',
      age: 25,
      gender: 'Male',
      occupation: 'Software Engineer',
      address: 'Xuan Khanh, Ninh Kieu, Can Tho',
      bloodType: 'O',
    },
  ];
  customizeText(arg: any) {
    return arg.valueText + ' BPM';
  }

  currentPatient: Customer = this.patientList[0];

  listSelectionChanged = (e: any) => {
    this.currentPatient = e.addedItems[0];
  };
  constructor(private store: StoreService) {}

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
