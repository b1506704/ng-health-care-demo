import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImageStore } from 'src/app/shared/services/image/image-store.service';
import { Image } from 'src/app/shared/models/image';
import { DxFileManagerComponent } from 'devextreme-angular';
@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss'],
})
export class FileManagementComponent implements OnInit {
  @ViewChild(DxFileManagerComponent, { static: false })
  dxFileManager: DxFileManagerComponent;
  //todo: implement CRUD apis
  fileItems: Array<any> = [
    {
      name: 'Images',
      isDirectory: true,
      items: [
        {
          name: 'Customers',
          isDirectory: true,
          items: [],
        },
        {
          name: 'Doctors',
          isDirectory: true,
          items: [],
        },
        {
          name: 'Medicines',
          isDirectory: true,
          items: [],
        },
      ],
    },
  ];
  isPopupVisible!: boolean;
  currentFile!: any;
  uploadButtonOption: any = {};
  imageList: Array<Image> = [];
  currentIndexFromServer!: number;
  pageSize: number = 10;

  constructor(private router: Router, private imageStore: ImageStore) {}

  onSelectionChanged(e: any) {
    console.log('SELECTION CHANGED');
    console.log(e);
  }

  onToolbarItemClick(e: any) {
    console.log('TOOLBAR ITEM');
    console.log(e);
  }

  onOptionChanged(e: any) {
    console.log('OPTION CHANGED');
    console.log(e);
    if (e.fullName === 'currentPath') {
      switch (e.value) {
        case 'Images/Doctors':
          this.imageStore
            .initInfiniteFilterByCategoryData('doctor', 0, this.pageSize)
            .then(() => {
              this.fileItems[0].items[1].items = [];
              this.mapImageByCategory();
            });
          break;
        case 'Images/Customers':
          this.imageStore
            .initInfiniteFilterByCategoryData('customer', 0, this.pageSize)
            .then(() => {
              this.fileItems[0].items[0].items = [];
              this.mapImageByCategory();
            });
          break;
        case 'Images/Medicines':
          this.imageStore
            .initInfiniteFilterByCategoryData('medicine', 0, this.pageSize)
            .then(() => {
              this.fileItems[0].items[2].items = [];
              this.mapImageByCategory();
            });
          break;
        default:
          break;
      }
    }
  }

  displayImagePopup(e: any) {
    this.currentFile = e.file;
    this.isPopupVisible = true;
    console.log('OPENED FILE: ');
    console.log(e.file);
  }

  navigateToStatistics() {
    this.router.navigate(['/statistics']);
  }

  imageDataListener() {
    return this.imageStore.$imageList.subscribe((data: any) => {
      if (data.length !== 0) {
        this.imageList = data;
        console.log('IMAGE LIST OF FILE MANAGEMENT');
        console.log(this.imageList);
        this.mapImageByCategory();
      }
    });
  }

  currentPageListener() {
    return this.imageStore.$currentPage.subscribe((data: any) => {
      this.currentIndexFromServer = data;
    });
  }

  mapImageByCategory() {
    if (this.imageList.length !== 0) {
      for (let i = 0; i < this.imageList.length; i++) {
        const image = this.imageList[i];
        switch (image?.category) {
          case 'customer':
            this.fileItems[0].items[0].items.push({
              type: image.fileType,
              category: image.category,
              sourceID: image.sourceID,
              name: image.title,
              isDirectory: false,
              size: image.fileSize,
              thumbnail: image.url,
            });
            break;
          case 'doctor':
            this.fileItems[0].items[1].items.push({
              type: image.fileType,
              category: image.category,
              sourceID: image.sourceID,
              name: image.title,
              isDirectory: false,
              size: image.fileSize,
              thumbnail: image.url,
            });
            break;
          case 'medicine':
            this.fileItems[0].items[2].items.push({
              type: image.fileType,
              category: image.category,
              sourceID: image.sourceID,
              name: image.title,
              isDirectory: false,
              size: image.fileSize,
              thumbnail: image.url,
            });
            break;
          default:
            break;
        }
      }
    }
    console.log('CURRENT FILES');
    console.log(this.fileItems);
    this.dxFileManager.instance.refresh();
  }

  ngOnInit(): void {
    this.currentPageListener();
    this.imageDataListener();
  }

  ngOnDestroy(): void {
    this.currentPageListener().unsubscribe();
    this.imageDataListener().unsubscribe();
  }
}
