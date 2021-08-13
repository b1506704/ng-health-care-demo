import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Doctor } from 'src/app/shared/models/doctor';
import { DoctorStore } from '../../../../shared/services/doctor/doctor-store.service';
import { Image } from 'src/app/shared/models/image';
import { ImageHttpService } from 'src/app/shared/services/image/image-http.service';
@Component({
  selector: 'app-doctor-detail',
  templateUrl: 'doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.scss'],
})
export class DoctorDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() doctorID!: string;
  doctorData!: Doctor;
  fieldList: Array<Object> = [];
  imageData: Image = {
    sourceID: '',
    category: '',
    title: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    url: '../../../../assets/imgs/profile.png',
  };
  constructor(
    private doctorStore: DoctorStore,
    private imageService: ImageHttpService
  ) {}

  doctorDataListener() {
    return this.doctorStore.$doctorInstance.subscribe((data: any) => {
      this.doctorData = data;
      this.imageService.getImageBySourceID(data._id).subscribe((data: any) => {
        if (data !== null) {
          this.imageData = data;
        }
      });
    });
  }

  renderSourceData() {
    this.doctorData = null;
    setTimeout(() => {
      this.doctorStore.getDoctor(this.doctorID).then(() => {
        this.doctorDataListener();
      });
    }, 100);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.renderSourceData();
  }

  ngOnDestroy(): void {
    this.doctorDataListener().unsubscribe();
  }
}
