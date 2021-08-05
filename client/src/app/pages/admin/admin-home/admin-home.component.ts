import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxGalleryComponent } from 'devextreme-angular';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent implements OnInit {
  @ViewChild(DxGalleryComponent, { static: false })
  dxGallery: DxGalleryComponent;
  baseImgUrl: string = '../../../../assets/imgs/';
  currentItem: any;
  date: Number = new Date().getFullYear();
  dataSource: Array<Object> = [
    {
      title: 'DYNAMIC STATISTICS',
      subTitle: 'Various charts with auto-calculated figures and range selectors',
      imgUrl: this.baseImgUrl + 'landing_page_admin_1.jpg',
      link: 'statistics',
    },
    {
      title: 'USER-FRIENDLY USER MANAGEMENT SYSTEM',
      subTitle:
        'Fully functioned editor with office plugin to export PDF and XLSX',
      imgUrl: this.baseImgUrl + 'landing_page_admin_2.jfif',
      link: 'edit_customer_list',
    },
    {
      title: 'SCHEDULE AND BILL EDITOR',
      subTitle:
        'Provide a tool for admins to manage on-going schedule and transactions',
      imgUrl: this.baseImgUrl + 'landing_page_admin_3.jpg',
      link: 'edit_schedule',
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
