import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImageStore } from 'src/app/shared/services/image/image-store.service';
import { Image } from 'src/app/shared/models/image';
import { DxFileManagerComponent } from 'devextreme-angular';
import { StoreService } from 'src/app/shared/services/store.service';
@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss'],
})
export class FileManagementComponent implements OnInit {
  @ViewChild(DxFileManagerComponent, { static: false })
  dxFileManager: DxFileManagerComponent;
  isDirectory: boolean = true;
  currentDirectory: string = 'Images';
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
  isUploadPopupVisible!: boolean;
  isUploadingImage!: boolean;
  currentFile!: any;
  uploadButtonOption: any = {};
  imageList: Array<Image> = [];
  selectedKeys: Array<string> = [];
  selectedItemKey: string;
  selectedItem: any;
  currentIndexFromServer!: number;
  pageSize: number = 100;
  newFileMenuOptions = {
    items: [
      {
        text: 'Create',
        icon: 'image',
      },
    ],
    onItemClick: this.uploadImage.bind(this),
  };
  refreshMenuOptions = {
    items: [
      {
        text: 'Refresh',
        icon: 'refresh',
      },
    ],
    onItemClick: this.refresh.bind(this),
  };
  deleteMenuOptions = {
    items: [
      {
        text: 'Delete',
        icon: 'trash',
      },
    ],
    onItemClick: this.deleteImages.bind(this),
  };
  updateMenuOptions = {
    items: [
      {
        text: 'Update',
        icon: 'edit',
      },
    ],
    onItemClick: this.updateImage.bind(this),
  };

  constructor(
    private router: Router,
    private imageStore: ImageStore,
    private store: StoreService
  ) {}

  uploadImage() {
    this.isUploadPopupVisible = true;
  }

  deleteImages() {
    if (this.selectedKeys.length !== 0) {
      this.imageStore
        .confirmDialog('Delete selected items?')
        .then((confirm: boolean) => {
          if (confirm) {
            this.imageStore.deleteSelectedImages(this.selectedKeys).then(() => {
              this.refresh();
              this.store.showNotif(
                `${this.selectedItemKey.length} item deleted`,
                'custom'
              );
            });
          }
        });
    }
  }

  deleteSelectedImage() {
    if (this.selectedItemKey.length !== 0) {
      this.imageStore
        .confirmDialog('Delete this item?')
        .then((confirm: boolean) => {
          if (confirm) {
            this.imageStore.deleteImage(this.selectedItemKey).then(() => {
              this.refresh();
              this.store.showNotif('1 item deleted', 'custom');
            });
          }
        });
    }
  }

  updateImage() {
    this.isUploadPopupVisible = true;
  }

  refresh() {
    switch (this.currentDirectory) {
      case 'Images/Doctors':
        this.isDirectory = false;
        this.imageStore
          .initInfiniteFilterByCategoryData('doctor', 0, this.pageSize)
          .then(() => {
            this.mapImageByCategory();
          });
        break;
      case 'Images/Customers':
        this.isDirectory = false;
        this.imageStore
          .initInfiniteFilterByCategoryData('customer', 0, this.pageSize)
          .then(() => {
            this.mapImageByCategory();
          });
        break;
      case 'Images/Medicines':
        this.isDirectory = false;
        this.imageStore
          .initInfiniteFilterByCategoryData('medicine', 0, this.pageSize)
          .then(() => {
            this.mapImageByCategory();
          });
        break;
      default:
        this.isDirectory = true;
        break;
    }
  }

  onSelectionChanged(e: any) {
    console.log('SELECTION CHANGED');
    console.log(e);
    this.selectedKeys = e.selectedItemKeys;
    this.selectedItemKey = e.currentSelectedItemKeys[0];
    this.selectedItem = e.selectedItems[0]?.dataItem;
  }

  onToolbarItemClick(e: any) {
    console.log('TOOLBAR ITEM');
    console.log(e);
  }

  onContextItemClick(e: any) {
    console.log('CONTEXT MENU ITEM');
    console.log(e);
    switch (e.itemData.name) {
      case 'newImage':
        this.uploadImage();
        break;
      case 'deleteImage':
        this.deleteSelectedImage();
        break;
      case 'updateImage':
        this.updateImage();
        break;
      default:
        break;
    }
  }

  onOptionChanged(e: any) {
    console.log('OPTION CHANGED');
    console.log(e);
    if (e.fullName === 'currentPath') {
      this.currentDirectory = e.value;
      this.refresh();
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
      }
    });
  }

  currentPageListener() {
    return this.imageStore.$currentPage.subscribe((data: any) => {
      this.currentIndexFromServer = data;
    });
  }

  isUploadingImageListener() {
    return this.imageStore.$isUploadingImage.subscribe((data: boolean) => {
      this.isUploadPopupVisible = data;
      if (this.isUploadPopupVisible === false) {
        this.refresh();
      }
    });
  }

  mapImageByCategory() {
    this.fileItems[0].items[0].items = [];
    this.fileItems[0].items[1].items = [];
    this.fileItems[0].items[2].items = [];
    if (this.imageList.length !== 0) {
      for (let i = 0; i < this.imageList.length; i++) {
        const image = this.imageList[i];
        switch (image?.category) {
          case 'customer':
            this.fileItems[0].items[0].items.push({
              type: image.fileType,
              category: image.category,
              __KEY__: image.sourceID,
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
              __KEY__: image.sourceID,
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
              __KEY__: image.sourceID,
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
    this.isUploadingImageListener();
  }

  ngOnDestroy(): void {
    this.currentPageListener().unsubscribe();
    this.imageDataListener().unsubscribe();
    this.isUploadingImageListener().unsubscribe();
  }
}
