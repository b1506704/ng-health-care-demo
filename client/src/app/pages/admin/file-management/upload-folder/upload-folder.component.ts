import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { StoreService } from 'src/app/shared/services/store.service';
import { FileStore } from 'src/app/shared/services/file/file-store.service';
@Component({
  selector: 'app-upload-folder',
  templateUrl: './upload-folder.component.html',
  styleUrls: ['./upload-folder.component.scss'],
})
export class UploadFolderComponent implements OnInit, OnDestroy, OnChanges {
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
  isUploading!: boolean;
  containerData: any = {
    name: '',
    parentDir: this.directory,
  };
  constructor(private store: StoreService, private fileStore: FileStore) {}

  isUploadingListener() {
    return this.fileStore.$isUploading.subscribe((data: boolean) => {
      this.isUploading = data;
    });
  }

  resetValues() {
    this.containerData = {
      name: '',
      parentDir: this.directory,
    };
  }

  onSubmit = (e: any) => {
    e.preventDefault();
    this.fileStore.uploadContainer(this.containerData);
    this.resetValues();
  };

  ngOnInit(): void {
    this.isUploadingListener();
  }

  ngOnChanges(): void {
    this.resetValues();
  }

  ngOnDestroy(): void {
    this.isUploadingListener().unsubscribe();
  }
}
