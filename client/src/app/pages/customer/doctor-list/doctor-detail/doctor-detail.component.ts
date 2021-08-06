import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Doctor } from 'src/app/shared/models/doctor';
import { DoctorStore } from '../../../../shared/services/doctor/doctor-store.service';
@Component({
  selector: 'app-doctor-detail',
  templateUrl: 'doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.scss'],
})
export class DoctorDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() doctorID!: string;
  doctorData!: Doctor;
  fieldList: Array<Object> = [];
  constructor(private doctorStore: DoctorStore) {}

  doctorDataListener() {
    return this.doctorStore.$doctorInstance.subscribe((data: any) => {
      this.doctorData = data;
    });
  }

  renderSourceData() {
    this.doctorStore.getDoctor(this.doctorID).then(() => {
      this.doctorDataListener();
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.renderSourceData();
  }

  ngOnDestroy(): void {
    this.doctorDataListener().unsubscribe();
  }
}
