import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImageStore } from 'src/app/shared/services/image/image-store.service';
import { Image } from 'src/app/shared/models/image';
import { DxFileManagerComponent } from 'devextreme-angular';
import { StoreService } from 'src/app/shared/services/store.service';
import { FileStore } from 'src/app/shared/services/file/file-store.service';
import { Container } from 'src/app/shared/models/container';
import { File } from 'src/app/shared/models/file';
@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss'],
})
export class FileManagementComponent implements OnInit {
  @ViewChild(DxFileManagerComponent, { static: false })
  dxFileManager: DxFileManagerComponent;
  isItemMode = false;
  isDirectorySelected: boolean = true;
  currentDirectory: string = '';
  fileItems: Array<any> = [];
  isPopupVisible!: boolean;
  isUploadPopupVisible!: boolean;
  isUploadBatchPopupVisible!: boolean;
  isUploadContainerPopupVisible!: boolean;
  isUpdateContainerPopupVisible!: boolean;
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
        text: 'Upload Image',
        icon: 'image',
        hint: 'Upload new image',
      },
    ],
    onItemClick: this.uploadImage.bind(this),
  };
  newFilesMenuOptions = {
    items: [
      {
        text: 'Upload Batch',
        icon: 'upload',
        hint: 'Upload multiple files',
      },
    ],
    onItemClick: this.uploadBatch.bind(this),
  };
  newContainerMenuOptions = {
    items: [
      {
        text: 'Create Folder',
        icon: 'newfolder',
        hint: 'Upload new folder',
      },
    ],
    onItemClick: this.uploadContainer.bind(this),
  };
  refreshMenuOptions = {
    items: [
      {
        text: 'Refresh',
        icon: 'refresh',
        hint: 'Refresh folder directory',
      },
    ],
    onItemClick: this.refresh.bind(this),
  };
  deleteMenuOptions = {
    items: [
      {
        text: 'Delete Image',
        icon: 'trash',
        hint: 'Delete current image',
      },
    ],
    onItemClick: this.deleteImages.bind(this),
  };
  downloadZipMenuOptions = {
    items: [
      {
        text: 'Download Zip',
        icon: 'download',
        hint: 'Download as zip',
      },
    ],
    onItemClick: this.downloadZip.bind(this),
  };
  updateMenuOptions = {
    items: [
      {
        text: 'Update Image',
        icon: 'edit',
        hint: 'Edit current image',
      },
    ],
    onItemClick: this.updateImage.bind(this),
  };
  deleteFolderMenuOptions = {
    items: [
      {
        text: 'Delete Folder',
        icon: 'deletetable',
        hint: 'Delete current folder',
      },
    ],
    onItemClick: this.deleteSelectedContainer.bind(this),
  };
  renameFolderMenuOptions = {
    items: [
      {
        text: 'Rename Folder',
        icon: 'edit',
        hint: 'Rename current folder',
      },
    ],
    onItemClick: this.updateContainer.bind(this),
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

  updateContainer() {
    this.isUpdateContainerPopupVisible = true;
  }

  deleteSelectedContainer() {
    if (this.currentDirectory) {
      this.fileStore
        .confirmDialog(`Delete '${this.currentDirectory}' folder?`)
        .then((confirm: boolean) => {
          if (confirm) {
            this.fileStore.deleteContainer(this.currentDirectory).then(() => {
              this.refreshFolder();
              this.store.showNotif(
                `'${this.currentDirectory}' folder deleted`,
                'custom'
              );
              this.store.setIsLoading(false);
            });
          }
        });
    }
  }

  uploadImage() {
    this.isUploadPopupVisible = true;
  }

  uploadBatch() {
    this.isUploadBatchPopupVisible = true;
  }

  deleteImages() {
    if (this.selectedKeys.length !== 0) {
      this.fileStore
        .confirmDialog('Delete selected items?')
        .then((confirm: boolean) => {
          if (confirm) {
            this.fileStore
              .deleteSelectedFiles(this.selectedKeys, this.currentDirectory)
              .then(() => {
                this.refresh();
                this.store.showNotif(
                  `${this.selectedKeys.length} item deleted`,
                  'custom'
                );
                this.store.setIsLoading(false);
              });
          }
        });
    }
  }

  deleteSelectedImage() {
    if (this.selectedItemKey.length !== 0) {
      this.fileStore
        .confirmDialog('Delete this item?')
        .then((confirm: boolean) => {
          if (confirm) {
            this.fileStore
              .deleteFile(this.selectedItemKey, this.currentDirectory)
              .then(() => {
                this.refresh();
                this.store.showNotif('1 item deleted', 'custom');
                this.store.setIsLoading(false);
              });
          }
        });
    }
  }

  updateImage() {
    this.isUploadPopupVisible = true;
  }

  downloadImage() {
    if (this.selectedItemKey.length !== 0) {
      this.fileStore
        .confirmDialog('Download this item?')
        .then((confirm: boolean) => {
          if (confirm) {
            this.fileStore.downloadFile(
              this.selectedItemKey,
              this.currentDirectory
            );
          }
        });
    }
  }

  downloadZip() {
    if (this.selectedKeys.length !== 0) {
      this.fileStore
        .confirmDialog('Download selected items as zip?')
        .then((confirm: boolean) => {
          if (confirm) {
            this.fileStore.downloadFiles(
              this.selectedKeys,
              this.currentDirectory
            );
          }
        });
    }
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
    this.fileList = [];
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
    if (e.selectedItems) {
      e.selectedItems.forEach((item: any) => {
        this.isDirectorySelected = item.isDirectory;
      });
    }
    this.selectedItem = e.selectedItems[0]?.dataItem;
    console.log('IS DIRECTORY SELECTED: ', this.isDirectorySelected);
  }

  onToolbarItemClick(e: any) {
    console.log('TOOLBAR ITEM');
    console.log(e);
  }

  onContextItemClick(e: any) {
    console.log('CONTEXT MENU ITEM');
    console.log(e);
    switch (e.itemData.name) {
      case 'downloadImage':
        this.downloadImage();
        break;
      case 'newImage':
        this.uploadImage();
        break;
      case 'deleteImage':
        this.deleteSelectedImage();
        break;
      case 'updateImage':
        this.updateImage();
        break;
      case 'newFolder':
        this.uploadContainer();
        break;
      case 'deleteFolder':
        this.deleteSelectedContainer();
        break;
      case 'updateFolder':
        this.updateContainer();
        break;
      default:
        break;
    }
  }

  onOptionChanged(e: any) {
    console.log('OPTION CHANGED');
    console.log(e);
    if (e.fullName === 'currentPath') {
      if (e.value !== '') {
        this.isItemMode = true;
      } else {
        this.isItemMode = false;
      }
      console.log('IS ITEM MODE: ', this.isItemMode);
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
    return this.fileStore.$isUploading.subscribe((data: boolean) => {
      this.isUploadPopupVisible = data;
      this.isUploadBatchPopupVisible = data;
      if (data === false) {
        this.refresh();
      }
    });
  }

  isUploadingFolderListener() {
    return this.fileStore.$isUploadingFolder.subscribe((data: boolean) => {
      this.isUploadContainerPopupVisible = data;
      if (this.isUploadContainerPopupVisible === false) {
        this.refreshFolder();
      }
    });
  }

  isUpdatingFolderListener() {
    return this.fileStore.$isUpdatingFolder.subscribe((data: boolean) => {
      this.isUpdateContainerPopupVisible = data;
      if (data === false) {
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
      }, 100);
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
          __KEY__: file.name,
          name: file.name,
          isDirectory: false,
          size: file.properties.contentLength,
          thumbnail: file.url,
        });
      }
    }
    console.log(this.fileItems[folderIndex].items);
    console.log('CURRENT DX FILES');
    console.log(this.fileItems);
    // setTimeout(() => {
    this.dxFileManager.instance.refresh();
    // }, 500);
  }

  containerDataListener() {
    return this.fileStore.$containerList.subscribe((data: any) => {
      if (data.length !== 0) {
        this.containerList = data;
        // setTimeout(() => {
        this.mapContainerToFolder();
        // }, 100);
      }
    });
  }

  ngOnInit(): void {
    this.refreshFolder();
    this.fileDataListener();
    this.currentPageListener();
    this.isUploadingListener();
    this.isUploadingFolderListener();
    this.isUpdatingFolderListener();
  }

  ngOnDestroy(): void {
    this.containerDataListener().unsubscribe();
    this.currentPageListener().unsubscribe();
    this.fileDataListener().unsubscribe();
    this.isUploadingListener().unsubscribe();
    this.isUploadingFolderListener().unsubscribe();
    this.isUpdatingFolderListener().unsubscribe();
  }
}
