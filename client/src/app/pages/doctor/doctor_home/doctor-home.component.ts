import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxGalleryComponent } from 'devextreme-angular';

@Component({
  templateUrl: 'doctor-home.component.html',
  styleUrls: ['./doctor-home.component.scss'],
})
export class DoctorHomeComponent implements OnInit {
  @ViewChild(DxGalleryComponent, { static: false })
  dxGallery: DxGalleryComponent;
  baseImgUrl: string = '../../../../assets/imgs/';
  currentItem: any;
  date: Number = new Date().getFullYear();
  dataSource: Array<Object> = [
    {
      title: 'REAL-TIME MONITORING SERVICE',
      subTitle: 'Stable and high-quality on-bed device tracking',
      imgUrl: this.baseImgUrl + 'landing_page_1.jpg',
      link: 'room_monitor',
    },
    {
      title: 'USER-FRIENDLY PRESCRIPTION MANAGEMENT SYSTEM',
      subTitle:
        'Fully functioned editor with office plugin to export PDF and XLSX',
      imgUrl: this.baseImgUrl + 'landing_page_2.jpg',
      link: 'edit_medical_checkup_list',
    },
    {
      title: 'SCHEDULE MANAGEMENT INTERFACE',
      subTitle: 'Provide dynamic UI to organize medical-checkups schedule',
      imgUrl: this.baseImgUrl + 'landing_page_3.jpg',
      link: 'schedule_list',
    },
    {
      title: 'MEDICINE AND DISEASE ENCYCLOPEDIA',
      subTitle:
        'Provide a tool for doctors to update on-going medical changes ',
      imgUrl: this.baseImgUrl + 'landing_page_4.jpg',
      link: 'edit_medicine_list',
    },
  ];
  slideshowDelay: number = 2500;
  featureList: Array<any>;
  constructor(private router: Router) {}

  onSelectionChanged(e: any) {
    this.currentItem = e.addedItems[0];
  }

  navigateInside() {
    this.router.navigate([this.currentItem.link]);
  }

  ngOnInit(): void {}
}
