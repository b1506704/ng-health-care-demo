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
import { CustomerHttpService } from 'src/app/shared/services/customer/customer-http.service';
import { DoctorHttpService } from 'src/app/shared/services/doctor/doctor-http.service';
import { MedicineHttpService } from 'src/app/shared/services/medicine/medicine-http.service';
import { ImageHttpService } from 'src/app/shared/services/image/image-http.service';
import { FileStore } from 'src/app/shared/services/file/file-store.service';
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
  isUploading!: boolean;
  searchPlaceholder!: string;
  searchCategory!: string;
  searchValue!: string;
  selectedData: any;
  searchData: Array<any> = [];
  valueExpr!: string;
  pageSize: number = 100;
  timeout: any;
  isOpenSuggestionTimeout: any;
  isOpenSuggestion!: boolean;

  constructor(
    private imageStore: ImageStore,
    private imageService: ImageHttpService,    
    private store: StoreService,
    private customerService: CustomerHttpService,
    private doctorService: DoctorHttpService,
    private medicineService: MedicineHttpService
  ) {}

  onCategoryValueChanged(e: any) {
    this.imageData.category = e.value;
    this.searchValue = '';
    switch (e.value) {
      case 'customer':
      case 'doctor':
        this.valueExpr = 'fullName';
        this.searchCategory = 'Full Name';
        this.searchPlaceholder = 'Search full name';
        break;
      case 'medicine':
        this.valueExpr = 'name';
        this.searchCategory = 'Medicine Name';
        this.searchPlaceholder = 'Search medicine name';
        break;
      default:
        break;
    }
  }

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
    this.setImageCategory();
  }

  isUploadingListener() {
    return this.imageStore.$isUploading.subscribe((data: boolean) => {
      this.isUploading = data;
    });
  } 

  onItemClick(e: any) {
    this.selectedData = e.itemData;
    console.log('SELECTED DATA');
    console.log(this.selectedData);
    this.imageData.sourceID = e.itemData._id;
    this.isUploading = true;
    this.imageService
      .getImageBySourceID(e.itemData._id)
      .subscribe((data: any) => {
        this.isUploading = false;
        if (data !== null) {
          console.log('IMAGE BY AUTOCOMPLETE');
          console.log(data);
          this.imageData.url = data?.url;
        } else {
          this.imageData.url = '../../../../assets/imgs/profile.png';
        }
      });
    switch (this.imageData?.category) {
      case 'doctor':
      case 'customer':
        this.imageData.title = e.itemData.fullName;
        this.imageData.fileName = e.itemData.fullName;
        break;
      case 'medicine':
        this.imageData.title = e.itemData.name;
        this.imageData.fileName = e.itemData.name;
        break;
      default:
        break;
    }
  }

  onSearchKeyUpHandler(e: any) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      switch (this.imageData?.category) {
        case 'doctor':
          this.doctorService
            .searchDoctorByName(this.searchValue, 0, this.pageSize)
            .subscribe((data: any) => {
              if (data.length !== 0) {
                this.searchData = data.items;
                // this.searchData = data.items.map((e: any) => e.fullName);
                if (this.searchData.length === 0) {
                  this.store.showNotif('There is no matched item!', 'custom');
                } else {
                  clearTimeout(this.isOpenSuggestionTimeout);
                  this.isOpenSuggestion = false;
                  this.isOpenSuggestionTimeout = setTimeout(() => {
                    this.isOpenSuggestion = true;
                  }, 500);
                }
                console.log('SEARCH DATA');
                console.log(this.searchData);
              }
            });
          break;
        case 'customer':
          this.customerService
            .searchCustomerByName(this.searchValue, 0, this.pageSize)
            .subscribe((data: any) => {
              if (data.length !== 0) {
                this.searchData = data.items;
                // this.searchData = data.items.map((e: any) => e.fullName);
                if (this.searchData.length === 0) {
                  this.store.showNotif('There is no matched item!', 'custom');
                } else {
                  clearTimeout(this.isOpenSuggestionTimeout);
                  this.isOpenSuggestion = false;
                  this.isOpenSuggestionTimeout = setTimeout(() => {
                    this.isOpenSuggestion = true;
                  }, 500);
                }
                console.log('SEARCH DATA');
                console.log(this.searchData);
              }
            });
          break;
        case 'medicine':
          this.medicineService
            .searchMedicineByName(this.searchValue, 0, this.pageSize)
            .subscribe((data: any) => {
              if (data.length !== 0) {
                this.searchData = data.items;
                // this.searchData = data.items.map((e: any) => e.fullName);
                if (this.searchData.length === 0) {
                  this.store.showNotif('There is no matched item!', 'custom');
                } else {
                  clearTimeout(this.isOpenSuggestionTimeout);
                  this.isOpenSuggestion = false;
                  this.isOpenSuggestionTimeout = setTimeout(() => {
                    this.isOpenSuggestion = true;
                  }, 500);
                }
                console.log('SEARCH DATA');
                console.log(this.searchData);
              }
            });
          break;
        default:
          break;
      }
    }, 1250);
  }

  onSubmit = (e: any) => {
    e.preventDefault();
    this.imageStore.uploadImage(this.imageData, 0, 5);
    this.resetValues();
  };

  ngOnInit(): void {
    this.isUploadingListener();
  }

  setImageCategory() {
    switch (this.directory) {
      case 'Images/Doctors':
        this.searchValue = '';
        this.valueExpr = 'fullName';
        this.searchPlaceholder = 'Find sourceID by full name';
        this.imageData.category = 'doctor';
        break;
      case 'Images/Customers':
        this.searchValue = '';
        this.valueExpr = 'fullName';
        this.searchPlaceholder = 'Find sourceID by full name';
        this.imageData.category = 'customer';
        break;
      case 'Images/Medicines':
        this.searchValue = '';
        this.valueExpr = 'name';
        this.searchPlaceholder = 'Find sourceID by name';
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
    this.isUploadingListener().unsubscribe();
  }
}
