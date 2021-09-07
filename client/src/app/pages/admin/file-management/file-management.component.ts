import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
    this.keyCombination.push(event.key);
    if (this.keyCombination.length > 2) {
      this.keyCombination = [];
    }
    this.handleOperation(this.keyCombination);
  }
  keyCombination: Array<string> = [];
  isItemMode = false;
  isDirectorySelected: boolean = true;
  currentDirectory: string = '';
  fileItems: Array<any> = [];
  isPopupVisible!: boolean;
  isUploadPopupVisible!: boolean;
  isUploadBatchPopupVisible!: boolean;
  isUploadContainerPopupVisible!: boolean;
  isUpdateContainerPopupVisible!: boolean;
  isKeyShortcutPopupVisible!: boolean;
  isUploading!: boolean;
  isCopying!: boolean;
  isMoving!: boolean;
  sourceDirectory!: string;
  tempCopyItems: Array<string> = [];
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
  copyMenuOptions = {
    items: [
      {
        text: 'Copy',
        icon: 'copy',
        hint: 'Copy selected items',
      },
    ],
    onItemClick: this.copyImages.bind(this),
  };
  pasteMenuOptions = {
    items: [
      {
        text: 'Paste',
        icon: 'paste',
        hint: 'Paste selected items',
      },
    ],
    onItemClick: this.pasteImages.bind(this),
  };
  clearClipboardMenuOptions = {
    items: [
      {
        text: 'Clear Clipboard',
        icon: 'clear',
        hint: 'Clear memory of clipboard',
      },
    ],
    onItemClick: this.clearClipboard.bind(this),
  };
  moveMenuOptions = {
    items: [
      {
        text: 'Cut',
        icon: 'cut',
        hint: 'Cut selected items',
      },
    ],
    onItemClick: this.moveImages.bind(this),
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
  cloneFolderMenuOptions = {
    items: [
      {
        text: 'Clone Folder',
        icon: 'unselectall',
        hint: 'Clone current folder',
      },
    ],
    onItemClick: this.cloneContainer.bind(this),
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
              this.currentDirectory = '';
            });
          }
        });
    }
  }

  cloneContainer() {
    if (this.currentDirectory) {
      this.fileStore
        .confirmDialog(`Clone '${this.currentDirectory}' folder?`)
        .then((confirm: boolean) => {
          if (confirm) {
            this.fileStore.cloneContainer(this.currentDirectory).then(() => {
              this.refreshFolder();
              this.store.showNotif(
                `'${this.currentDirectory}' folder cloned`,
                'custom'
              );
              this.store.setIsLoading(false);
              this.currentDirectory = '';
            });
          }
        });
    }
  }

  uploadImage() {
    if (this.currentDirectory === '') {
      this.store.showNotif(
        'Please select a folder to upload file(s)',
        'custom'
      );
    } else {
      this.isUploadPopupVisible = true;
    }
  }

  uploadBatch() {
    if (this.currentDirectory === '') {
      this.store.showNotif(
        'Please select a folder to upload file(s)',
        'custom'
      );
    } else {
      this.isUploadBatchPopupVisible = true;
    }
  }

  deleteImages() {
    if (this.currentDirectory !== '') {
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
      } else {
        this.store.showNotif('Nothing to delete!', 'custom');
      }
    }
  }

  clearClipboard() {
    if (this.tempCopyItems.length) {
      this.isMoving = false;
      this.isCopying = false;
      this.sourceDirectory = '';
      this.tempCopyItems = [];
      this.store.showNotif(`Clipboard cleared!`, 'custom');
    } else {
      this.store.showNotif('No item is copied or cut!', 'custom');
    }
  }

  copyImages() {
    if (this.selectedKeys.length !== 0) {
      this.isMoving = false;
      this.isCopying = true;
      this.sourceDirectory = this.currentDirectory;
      this.tempCopyItems = this.selectedKeys;
      this.store.showNotif(
        `Copied ${this.selectedKeys.length} item(s)`,
        'custom'
      );
    } else {
      this.store.showNotif('No item selected!', 'custom');
    }
  }

  moveImages() {
    if (this.selectedKeys.length !== 0) {
      this.isCopying = false;
      this.isMoving = true;
      this.sourceDirectory = this.currentDirectory;
      this.tempCopyItems = this.selectedKeys;
      this.store.showNotif(`Cut ${this.selectedKeys.length} item(s)`, 'custom');
    } else {
      this.store.showNotif('No item selected!', 'custom');
    }
  }

  pasteImages() {
    if (this.tempCopyItems.length !== 0) {
      const editorMode = this.checkEditorMode();
      switch (editorMode) {
        case 'copy':
          this.performCopy();
          break;
        case 'move':
          this.performMove();
          break;
        default:
          break;
      }
    }
  }

  performCopy() {
    this.fileStore
      .confirmDialog(`Paste in ${this.currentDirectory} folder?`)
      .then((confirm: boolean) => {
        if (confirm) {
          this.isCopying = false;
          this.fileStore
            .copySelectedFiles(
              this.tempCopyItems,
              this.sourceDirectory,
              this.currentDirectory
            )
            .then((data: any) => {
              this.refresh();
              this.store.showNotif(data.message, 'custom');
              this.store.setIsLoading(false);
              this.tempCopyItems = [];
            })
            .catch((error) => {
              this.store.showNotif(error.message, 'error');
            });
        }
      });
  }

  performMove() {
    this.fileStore
      .confirmDialog(`Paste in ${this.currentDirectory} folder?`)
      .then((confirm: boolean) => {
        if (confirm) {
          this.isMoving = false;
          this.fileStore
            .moveSelectedFiles(
              this.tempCopyItems,
              this.sourceDirectory,
              this.currentDirectory
            )
            .then((data: any) => {
              this.refresh();
              this.store.showNotif(data.message, 'custom');
              this.store.setIsLoading(false);
              this.tempCopyItems = [];
            })
            .catch((error) => {
              this.store.showNotif(error.message, 'error');
            });
        }
      });
  }

  deleteSelectedImage() {
    if (this.currentDirectory !== '') {
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
  }

  updateImage() {
    if (this.currentDirectory !== '') {
      this.isUploadPopupVisible = true;
    }
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

  showKeyShortcut() {
    this.isKeyShortcutPopupVisible = true;
  }

  checkEditorMode() {
    if (this.isCopying) {
      return 'copy';
    }
    if (this.isMoving) {
      return 'move';
    }
    return '';
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
    if (e.selectedItems[0]?.isDirectory === true) {
      this.currentDirectory = e.selectedItems[0]?.dataItem.name;
    }
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
      case 'cloneFolder':
        this.cloneContainer();
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

  overwriteKeyHandler() {
    const keyList = [
      'backspace',
      'tab',
      'enter',
      'escape',
      'pageUp',
      'pageDown',
      'end',
      'home',
      'leftArrow',
      'upArrow',
      'rightArrow',
      'downArrow',
      'del',
      'space',
      'F',
      'A',
      'asterisk',
      'minus',
    ];
    for (let i = 0; i < keyList.length; i++) {
      const key = keyList[i];
      // remove default handler to add custom handler
      this.dxFileManager?.instance.registerKeyHandler(key, () => {});
    }
  }

  handleOperation(keyList: Array<string>) {
    //todo: add select item with arrow logic?
    // disable browser default Ctr T, Ctr N key shortcut?
    console.log('COMBINATION');
    console.log(keyList);
    const isClearClipboard = keyList.find((e) => e === 'Escape');
    const isDeleteFile =
      keyList.find((e) => e === 'Delete') && this.isDirectorySelected === false;
    const isCopyFile =
      keyList.find((e) => e === 'Control') &&
      keyList.find((e) => e === 'c') &&
      this.isDirectorySelected === false;
    const isMoveFile =
      keyList.find((e) => e === 'Control') &&
      keyList.find((e) => e === 'x') &&
      this.isDirectorySelected === false;
    const isPasteFile =
      keyList.find((e) => e === 'Control') && keyList.find((e) => e === 'v');
    const isUpdateFile =
      keyList.find((e) => e === 'F2') &&
      this.isDirectorySelected === false &&
      this.currentDirectory !== '';
    const isUploadFile = keyList.find((e) => e === 'PageUp');
    const isUploadBatch = keyList.find((e) => e === 'Insert');
    const isRenameFolder =
      keyList.find((e) => e === 'F2') &&
      this.isDirectorySelected === true &&
      this.currentDirectory !== '';
    const isNewFolder =
      keyList.find((e) => e === 'Control') &&
      keyList.find((e) => e === 'ArrowUp');
    const isDeleteFolder =
      keyList.find((e) => e === 'Delete') && this.isDirectorySelected === true;
    const isCloneFolder =
      keyList.find((e) => e === 'Control') &&
      keyList.find((e) => e === 'c') &&
      this.isDirectorySelected === true;
    if (isClearClipboard) {
      this.clearClipboard();
      this.keyCombination = [];
    }
    if (isDeleteFile) {
      this.deleteImages();
      this.keyCombination = [];
    }
    if (isUploadFile) {
      this.uploadImage();
      this.keyCombination = [];
    }
    if (isUploadBatch) {
      this.uploadBatch();
      this.keyCombination = [];
    }
    if (isCopyFile) {
      this.copyImages();
      this.keyCombination = [];
    }
    if (isMoveFile) {
      this.moveImages();
      this.keyCombination = [];
    }
    if (isPasteFile) {
      this.pasteImages();
      this.keyCombination = [];
    }
    if (isRenameFolder) {
      this.updateContainer();
    }
    if (isNewFolder) {
      this.uploadContainer();
    }
    if (isCloneFolder) {
      this.cloneContainer();
    }
    if (isDeleteFolder) {
      this.deleteSelectedContainer();
    }
    if (isUpdateFile) {
      this.updateImage();
    }
  }

  ngOnInit(): void {
    this.refreshFolder();
    this.fileDataListener();
    this.currentPageListener();
    this.isUploadingListener();
    this.isUploadingFolderListener();
    this.isUpdatingFolderListener();
    //overwrite default key handler
    setTimeout(() => {
      this.overwriteKeyHandler();
    }, 1500);
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
