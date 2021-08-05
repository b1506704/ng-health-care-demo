import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxGalleryComponent } from 'devextreme-angular';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.scss'],
})
export class CustomerHomeComponent implements OnInit {
  @ViewChild(DxGalleryComponent, { static: false })
  dxGallery: DxGalleryComponent;
  baseImgUrl: string = '../../../../assets/imgs/';
  currentItem: any;
  date: Number = new Date().getFullYear();
  dataSource: Array<Object> = [
    {
      title: 'MEDICAL CHECKUP REQUEST',
      subTitle:
        'Request and manage your checkups, see prescription in tab panel',
      imgUrl: this.baseImgUrl + 'landing_page_3.jpg',
      link: 'medical_checkup',
    },
    {
      title: 'HEALTH CONDITION OBSERVATION',
      subTitle: 'See your health condition statistics and contact with doctor',
      imgUrl: this.baseImgUrl + 'landing_page_5.jpg',
      link: 'health_condition',
    },
    {
      title: 'HELP CENTER AND WORKING SCHEDULE ',
      subTitle:
        'Medicine encyclopedia, doctor profile and working schedule of clinic',
      imgUrl: this.baseImgUrl + 'landing_page_admin_3.jpg',
      link: 'doctor_schedule',
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
