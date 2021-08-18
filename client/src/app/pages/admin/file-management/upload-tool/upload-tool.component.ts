import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ImageStore } from 'src/app/shared/services/image/image-store.service';
import { Image } from 'src/app/shared/models/image';
import { DxFormComponent } from 'devextreme-angular';
import { StoreService } from 'src/app/shared/services/store.service';
@Component({
  selector: 'app-upload-tool',
  templateUrl: './upload-tool.component.html',
  styleUrls: ['./upload-tool.component.scss'],
})
export class UploadToolComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild(DxFormComponent, { static: false }) dxForm: DxFormComponent;
  @Input() directory!: string;
  @Input() selectedItem!: any;
  submitButtonOptions: any = {
    text: 'Submit',
    icon: 'save',
    type: 'normal',
    useSubmitBehavior: true,
  };
  resetButtonOptions: any = {
    text: 'Reset',
    icon: 'refresh',
    type: 'normal',
    useSubmitBehavior: false,
    onClick: this.resetValues.bind(this),
  };
  imageData: Image = {
    sourceID: '',
    category: '',
    title: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    url: '../../../../assets/imgs/profile.png',
  };
  isUploadingImage!: boolean;

  constructor(private imageStore: ImageStore, private store: StoreService) {}

  handleInputChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    console.log(file);
    if (file !== undefined) {
      if (file.size <= 2000000) {
        this.imageData.fileSize = file.size;
        this.imageData.fileType = file.type;
        this.imageData.fileName = file.name;
        var pattern = /image-*/;
        var reader = new FileReader();

        if (!file.type.match(pattern)) {
          this.store.showNotif('Invalid format!', 'custom');
          return;
        }
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
      } else {
        this.store.showNotif('Image cannot exceed 2MB', 'custom');
      }
    }
  }

  handleReaderLoaded(e: any) {
    var reader = e.target;
    console.log('READER');
    console.log(reader);
    this.imageData.url = reader.result;
    console.log('SOURCE ID');
    console.log(this.imageData.sourceID);
  }

  resetValues() {
    this.imageData = {
      sourceID: '',
      category: '',
      title: '',
      fileName: '',
      fileSize: 0,
      fileType: '',
      url: '../../../../assets/imgs/profile.png',
    };
  }

  isUploadingImageListener() {
    return this.imageStore.$isUploadingImage.subscribe((data: boolean) => {
      this.isUploadingImage = data;
    });
  }

  onSubmit = (e: any) => {
    e.preventDefault();
    this.imageStore.uploadImage(this.imageData, 0, 5);
    this.resetValues();
  };

  ngOnInit(): void {
    this.isUploadingImageListener();
  }

  setImageCategory() {
    switch (this.directory) {
      case 'Images/Doctors':
        this.imageData.category = 'doctor';
        break;
      case 'Images/Customers':
        this.imageData.category = 'customer';
        break;
      case 'Images/Medicines':
        this.imageData.category = 'medicine';
        break;
      default:
        break;
    }
  }

  renderSelectedImage() {
    if (this.selectedItem) {
      console.log('SELECTED IMAGE');
      console.log(this.selectedItem);
      this.imageData.fileName = this.selectedItem.name;
      this.imageData.title = this.selectedItem.name;
      this.imageData.fileType = this.selectedItem.type;
      this.imageData.fileSize = this.selectedItem.size;
      this.imageData.category = this.selectedItem.category;
      this.imageData.url = this.selectedItem.thumbnail;
      this.imageData.sourceID = this.selectedItem.sourceID;
    }
  }

  ngOnChanges(): void {
    this.resetValues();
    this.renderSelectedImage();
    this.setImageCategory();
  }

  ngOnDestroy(): void {
    this.isUploadingImageListener().unsubscribe();
  }
}
