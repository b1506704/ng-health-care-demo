import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Customer } from 'src/app/shared/models/customer';
import { Socket } from 'ngx-socket-io';
import { CustomerStore } from 'src/app/shared/services/customer/customer-store.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { DxScrollViewComponent, DxTextBoxComponent } from 'devextreme-angular';
import { Image } from 'src/app/shared/models/image';
import { ImageHttpService } from 'src/app/shared/services/image/image-http.service';
@Component({
  selector: 'app-health-condition',
  templateUrl: './health-condition.component.html',
  styleUrls: ['./health-condition.component.scss'],
})
export class HealthConditionComponent implements OnInit, OnDestroy {
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
  co2Interval: any;
  stethoscopeInterval: any;
  aneroidInterval: any;
  patientDataInterval: any;
  thermometerInterval: any;
  popupVisible: boolean = false;
  commandPopupVisible: boolean = false;

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

  currentMessage: string = '';
  currentCommand: string = '';
  messageList: Array<Object> = [];
  currentCondition = this.socket.fromEvent<any>('condition');
  message = this.socket.fromEvent<any>('message');
  command = this.socket.fromEvent<any>('command');

  customizeText(arg: any) {
    return arg.valueText + ' BPM';
  }

  constructor(
    private socket: Socket,
    private customerStore: CustomerStore,
    private store: StoreService,
    private imageService: ImageHttpService
  ) {}

  getCondition(id: string) {
    this.socket.emit('getCondition', id);
  }

  newCondition(id: string) {
    this.socket.emit('newCondition', id);
  }

  getPatientID() {
    return this.store.$currentUser.subscribe((data: any) => {
      if (data !== null) {
        console.log('LOGGED IN USER:');
        console.log(data);
        this.customerStore.getCustomerByUserName(data?.userName).then(() => {
          this.customerStore.$customerInstance.subscribe((data: any) => {
            this.customerData = data;
            this.patientID = data._id;
            this.imageService
              .getImageBySourceID(data._id)
              .subscribe((data: any) => {
                if (data !== null) {
                  this.imageData = data;
                }
              });
            this.newCondition(data._id);
            this.patientDataInterval = setInterval(() => {
              this.getCondition(data._id);
            }, 1000);
            console.log('CURRENT CUSTOMER:');
            console.log(data);
            console.log(data._id);
          });
        });
      }
    });
  }

  pmPatient() {
    this.popupVisible = true;
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
        sender: this.customerData.fullName,
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
    this.getPatientID().unsubscribe();
    clearInterval(this.stethoscopeInterval);
    clearInterval(this.co2Interval);
    clearInterval(this.thermometerInterval);
    clearInterval(this.aneroidInterval);
    clearInterval(this.patientDataInterval);
    this.patientDataListener().unsubscribe();
    this.messageListener().unsubscribe();
    this.commandListener().unsubscribe();
    this.getPatientID().unsubscribe();
  }

  co2Socket() {
    this.co2Interval = setInterval(() => {
      this.socket.emit('co2', true);
    }, 1000);
  }

  stethoscopeSocket() {
    this.stethoscopeInterval = setInterval(() => {
      this.socket.emit('stethoscope', true);
    }, 1000);
  }

  thermometerSocket() {
    this.thermometerInterval = setInterval(() => {
      this.socket.emit('thermometer', true);
    }, 1000);
  }

  aneroidSocket() {
    this.aneroidInterval = setInterval(() => {
      this.socket.emit('aneroid', true);
    }, 1000);
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
        this.commandPopupVisible = true;
        this.currentCommand = data;
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

  ngOnInit(): void {
    this.getPatientID();
    this.co2Socket();
    this.thermometerSocket();
    this.aneroidSocket();
    this.stethoscopeSocket();
    this.messageListener();
    this.commandListener();
    this.patientDataListener();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
