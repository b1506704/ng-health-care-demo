import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/shared/models/customer';
import { Socket } from 'ngx-socket-io';
import { CustomerStore } from 'src/app/shared/services/customer/customer-store.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { DxScrollViewComponent, DxTextBoxComponent } from 'devextreme-angular';
import { Doctor } from 'src/app/shared/models/doctor';
import { DoctorStore } from 'src/app/shared/services/doctor/doctor-store.service';
import { ImageStore } from 'src/app/shared/services/image/image-store.service';
import { Image } from 'src/app/shared/models/image';
import { ImageHttpService } from 'src/app/shared/services/image/image-http.service';
@Component({
  selector: 'app-condition-detail',
  templateUrl: './condition-detail.component.html',
  styleUrls: ['./condition-detail.component.scss'],
})
export class ConditionDetailComponent implements OnInit, OnDestroy {
  @ViewChild(DxScrollViewComponent, { static: false })
  dxScrollView: DxScrollViewComponent;
  @ViewChild(DxTextBoxComponent, { static: false })
  dxTextBox: DxTextBoxComponent;
  visualRange: Object = {};
  patientData!: any;
  patientID: string;
  customerData: Customer;
  imageData: Image = {
    sourceID: '',
    category: '',
    title: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    url: '../../../../assets/imgs/profile.png',
  };
  doctorData: Doctor;
  stethoscopeSwitch: Boolean = true;
  thermometerSwitch: Boolean = true;
  co2Switch: Boolean = true;
  aneroidSwitch: Boolean = true;
  patientStatus: string = 'Healthy';
  popupVisible: boolean = false;
  isCallPatientActionVisible: boolean = false;
  positionOf: string;
  sendMessageButtonOption: any = {
    icon: 'arrowright',
    text: 'Send',
    type: 'normal',
    onClick: this.sendMessage.bind(this),
  };
  clearMessageButtonOption: any = {
    icon: 'trash',
    text: 'Clear',
    type: 'normal',
    onClick: this.clearMessage.bind(this),
  };
  commands: Array<any> = [
    { text: 'Please come to my office now' },
    { text: 'You will be discharged soon' },
    { text: 'We have your test results. Please come to my office now.' },
    { text: 'Please stay in your bed for further instruction' },
  ];
  currentMessage: string = '';
  messageList: Array<string> = [];
  currentCondition = this.socket.fromEvent<any>('condition');
  conditions = this.socket.fromEvent<Array<any>>('conditions');
  message = this.socket.fromEvent<any>('message');
  command = this.socket.fromEvent<any>('command');

  customizeText(arg: any) {
    return arg.valueText + ' BPM';
  }

  constructor(
    private socket: Socket,
    private route: ActivatedRoute,
    private customerStore: CustomerStore,
    private doctorStore: DoctorStore,
    private store: StoreService,
    private imageStore: ImageStore,
    private imageService: ImageHttpService
  ) {}

  getCondition(id: string) {
    this.socket.emit('getCondition', id);
  }

  newCondition() {
    this.socket.emit('newCondition', { id: this.patientID, condition: '' });
  }

  getPatientID() {
    return this.route.paramMap.subscribe((param) => {
      this.patientID = param.get('id');
      this.imageService
        .getImageBySourceID(param.get('id'))
        .subscribe((data: any) => {
          if (data !== null) {
            this.imageData = data;
          }
        });
      this.customerStore.getCustomer(param.get('id')).then(() => {
        this.customerStore.$customerInstance.subscribe((data: any) => {
          if (data !== null) {
            this.customerData = data;
            console.log(data);
          }
        });
      });
    });
  }

  getDoctorID() {
    return this.store.$currentUser.subscribe((data: any) => {
      if (data !== null) {
        console.log('LOGGED IN USER:');
        console.log(data);
        this.doctorStore.getDoctorByUserName(data.userName).then(() => {
          this.doctorStore.$doctorInstance.subscribe((data: any) => {
            this.doctorData = data;
          });
        });
      }
    });
  }

  pmPatient() {
    this.popupVisible = true;
  }

  sendCommand(e: any) {
    console.log(e.itemData.text);
    this.socket.emit('call', e.itemData.text);
    this.isCallPatientActionVisible = false;
  }

  onTextBoxValueChanged(e: any) {
    this.currentMessage = e.value;
  }

  onEnterKey() {
    this.sendMessage();
  }

  sendMessage() {
    if (this.currentMessage.trim() !== '') {
      this.socket.emit('sendMessage', {
        sender: this.doctorData.fullName,
        message: this.currentMessage,
        date: new Date().toLocaleTimeString(),
      });
      this.dxTextBox.instance.reset();
      this.dxScrollView.instance.scrollBy(
        this.dxScrollView.instance.scrollHeight() + 100
      );
    }
  }

  clearMessage() {
    this.messageList = [];
  }

  disconnect() {
    this.socket.removeListener('condition', this.getCondition);
    this.socket.removeListener('message', this.sendMessage);
    this.socket.removeListener('command', this.sendCommand);
    this.getPatientID().unsubscribe();
    this.patientDataListener().unsubscribe();
    this.patientListListener().unsubscribe();
    this.messageListener().unsubscribe();
    this.commandListener().unsubscribe();
  }

  commandPatient() {
    this.isCallPatientActionVisible = true;
  }

  closeCommand() {
    this.isCallPatientActionVisible = false;
  }

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
      this.socket.emit('co2Switch', true);
    } else {
      this.socket.emit('co2Switch', false);
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
      this.socket.emit('stethoscopeSwitch', true);
    } else {
      this.socket.emit('stethoscopeSwitch', false);
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
      this.socket.emit('thermometerSwitch', true);
    } else {
      this.socket.emit('thermometerSwitch', false);
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
      this.socket.emit('aneroidSwitch', true);
    } else {
      this.socket.emit('aneroidSwitch', false);
    }
  }

  messageListener() {
    return this.message.subscribe((data: any) => {
      console.log('CURRENT MESSAGE');
      console.log(data);
      this.messageList = this.messageList.concat(data);
      if (data !== '') {
        this.popupVisible = true;
      }
    });
  }

  commandListener() {
    return this.command.subscribe((data: any) => {
      console.log('CURRENT COMMAND');
      console.log(data);
      if (data !== '') {
        this.store.showNotif(`Your message to patient: ${data}`, 'custom');
      }
    });
  }

  patientDataListener() {
    return this.currentCondition.subscribe((data: any) => {
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
    this.getDoctorID();
    this.getPatientID();
    this.getCondition(this.patientID);
    this.co2Socket();
    this.thermometerSocket();
    this.aneroidSocket();
    this.stethoscopeSocket();
    this.messageListener();
    this.commandListener();
    this.patientDataListener();
    this.patientListListener();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
