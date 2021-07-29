import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerStore } from 'src/app/shared/services/customer/customer-store.service';
import { DoctorStore } from 'src/app/shared/services/doctor/doctor-store.service';
import { MedicalCheckupStore } from 'src/app/shared/services/medical-checkup/medical-checkup-store.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-prescription-editor',
  templateUrl: './prescription-editor.component.html',
  styleUrls: ['./prescription-editor.component.scss'],
})
export class PrescriptionEditorComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private medicalCheckupStore: MedicalCheckupStore,
    private store: StoreService,
    private customerStore: CustomerStore,
    private doctorStore: DoctorStore
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
