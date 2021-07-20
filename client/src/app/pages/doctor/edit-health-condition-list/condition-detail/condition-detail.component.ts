import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/shared/models/customer';
import { HealthCondition } from 'src/app/shared/models/health-condition';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-condition-detail',
  templateUrl: './condition-detail.component.html',
  styleUrls: ['./condition-detail.component.scss'],
})
export class ConditionDetailComponent implements OnInit, OnDestroy {
  visualRange: Object = {};
  patientData!: HealthCondition;
  patientID: String;
  randomInterval: any;
  currentPatient: Customer;
  patientStatus: string = 'Healthy';
  currentDocument = this.socket.fromEvent<Object>('document');
  documents = this.socket.fromEvent<string[]>('documents');

  customizeText(arg: any) {
    return arg.valueText + ' BPM';
  }

  constructor(private socket: Socket, private route: ActivatedRoute) {}

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }

  newDocument() {
    this.socket.emit('addDoc', { id: this.patientID, doc: '' });
  }

  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }

  getPatientID() {
    return this.route.paramMap.subscribe((param) => {
      this.patientID = param.get('id');
      this.newDocument();
      this.getDocument(param.get('id'));
    });
  }

  pmPatient() {}

  alertPatient() {}

  summonPatient() {}

  ngOnInit(): void {
    this.getPatientID();
    this.documents.subscribe((data: any) => {
      console.log('DATA FROM SOCKET');
      console.log(data);
    });
  }

  ngOnDestroy(): void {}
}
