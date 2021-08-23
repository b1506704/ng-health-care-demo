import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImageStore } from 'src/app/shared/services/image/image-store.service';
import { Image } from 'src/app/shared/models/image';
import { DxFileManagerComponent } from 'devextreme-angular';
import { StoreService } from 'src/app/shared/services/store.service';
import { FileStore } from 'src/app/shared/services/file/file-store.service';
import { Container } from 'src/app/shared/models/container';
import { File } from 'src/app/shared/models/file';
import { ImageUrl } from 'src/app/shared/models/image-url';
@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss'],
})
export class FileManagementComponent implements OnInit {
  @ViewChild(DxFileManagerComponent, { static: false })
  dxFileManager: DxFileManagerComponent;
  isDirectory: boolean = true;
  currentDirectory: string = '';
  fileItems: Array<any> = [];
  // {
  //   name: 'Images',
  //   isDirectory: true,
  // items: [
  // {
  //   name: 'Customers',
  //   isDirectory: true,
  //   items: [],
  // },
  // {
  //   name: 'Doctors',
  //   isDirectory: true,
  //   items: [],
  // },
  // {
  //   name: 'Medicines',
  //   isDirectory: true,
  //   items: [],
  // },
  // ],
  // },
  // ];
  isPopupVisible!: boolean;
  isUploadPopupVisible!: boolean;
  isUploadContainerPopupVisible!: boolean;
  isUploading!: boolean;
  currentFile!: any;
  uploadButtonOption: any = {};
  imageList: Array<Image> = [];
  fileList: Array<File> = [];
  selectedKeys: Array<string> = [];
  selectedItemKey: string;
  selectedItem: any;
  currentIndexFromServer!: number;
  pageSize: number = 5;
  newFileMenuOptions = {
    items: [
      {
        text: 'Create',
        icon: 'image',
      },
    ],
    onItemClick: this.uploadImage.bind(this),
  };
  newContainerMenuOptions = {
    items: [
      {
        text: 'Create Folder',
        icon: 'folder',
      },
    ],
    onItemClick: this.uploadContainer.bind(this),
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
  containerList: Array<Container> = [];

  constructor(
    private router: Router,
    private imageStore: ImageStore,
    private store: StoreService,
    private fileStore: FileStore
  ) {}

  uploadContainer() {
    this.isUploadContainerPopupVisible = true;
  }

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
                `${this.selectedKeys.length} item deleted`,
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

  refreshFolder() {
    this.fileStore.initInfiniteContainer(0, this.pageSize).then(() => {
      this.containerDataListener();
    });
  }

  refresh() {
    this.mapContainerToFolder();
    setTimeout(() => {
      this.loadFileByFolder();
    }, 500);
  }

  loadFileByFolder() {
    console.log(this.fileItems);
    this.isDirectory = false;
    if (this.currentDirectory !== '') {
      this.fileStore
        .initInfiniteDataByContainer(this.currentDirectory, this.pageSize)
        .then(() => {
          this.mapFileToImage();
        });
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
      this.loadFileByFolder();
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

  fileDataListener() {
    return this.fileStore.$fileList.subscribe((data: any) => {
      if (data.length !== 0) {
        this.fileList = data;
        console.log('FILE LIST OF FILE MANAGEMENT');
        console.log(this.fileList);
      }
    });
  }

  currentPageListener() {
    return this.imageStore.$currentPage.subscribe((data: any) => {
      this.currentIndexFromServer = data;
    });
  }

  isUploadingListener() {
    return this.imageStore.$isUploading.subscribe((data: boolean) => {
      this.isUploadPopupVisible = data;
      if (this.isUploadPopupVisible === false) {
        this.refresh();
      }
    });
  }

  isUploadingFolderListener() {
    return this.fileStore.$isUploading.subscribe((data: boolean) => {
      this.isUploadContainerPopupVisible = data;
      if (this.isUploadContainerPopupVisible === false) {
        this.refreshFolder();
      }
    });
  }

  mapContainerToFolder() {
    this.fileItems = [];
    if (this.containerList.length !== 0) {
      for (let i = 0; i < this.containerList.length; i++) {
        const container = this.containerList[i];
        console.log(container);
        if (container.name) {
          this.fileItems.push({
            name: container.name,
            isDirectory: true,
            items: [],
          });
        }
      }
      setTimeout(() => {
        this.dxFileManager.instance.refresh();
      }, 500);
    }
  }

  mapFileToImage() {
    const folderIndex = this.fileItems.findIndex(
      (e: any) => e.name === this.currentDirectory
    );
    this.fileItems[folderIndex].items = [];
    console.log(`Folder for inserting item index: ${folderIndex}`);
    if (this.fileList.length !== 0) {
      for (let i = 0; i < this.fileList.length; i++) {
        const file = this.fileList[i];
        this.fileItems[folderIndex].items.push({
          type: file.properties.contentType,
          category: file.metadata?.category,
          __KEY__: file.metadata?.sourceID || file.name,
          sourceID: file.metadata?.sourceID,
          name: file.metadata?.title || file.name,
          isDirectory: false,
          size: file.properties.contentLength,
          thumbnail: file.url,
        });
      }
    }
    console.log(this.fileItems[folderIndex].items);
    console.log('CURRENT DX FILES');
    console.log(this.fileItems);
    setTimeout(() => {
      this.dxFileManager.instance.refresh();
    }, 500);
  }

  containerDataListener() {
    return this.fileStore.$containerList.subscribe((data: any) => {
      if (data.length !== 0) {
        this.containerList = data;
        setTimeout(() => {
          this.mapContainerToFolder();
        }, 100);
      }
    });
  }

  ngOnInit(): void {
    this.refreshFolder();
    this.fileDataListener();
    this.currentPageListener();
    this.imageDataListener();
    this.isUploadingListener();
    this.isUploadingFolderListener();
  }

  ngOnDestroy(): void {
    this.containerDataListener().unsubscribe();
    this.currentPageListener().unsubscribe();
    this.imageDataListener().unsubscribe();
    this.fileDataListener().unsubscribe();
    this.isUploadingListener().unsubscribe();
    this.isUploadingFolderListener().unsubscribe();
  }
}
