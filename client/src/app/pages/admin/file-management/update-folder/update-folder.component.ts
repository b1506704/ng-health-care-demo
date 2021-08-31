import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { FileStore } from 'src/app/shared/services/file/file-store.service';
@Component({
  selector: 'app-update-folder',
  templateUrl: './update-folder.component.html',
  styleUrls: ['./update-folder.component.scss'],
})
export class UpdateFolderComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild(DxFormComponent, { static: false }) dxForm: DxFormComponent;
  @Input() selectedItem: string = '';
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
  };
  constructor(private fileStore: FileStore) {}

  isUploadingListener() {
    return this.fileStore.$isUpdatingFolder.subscribe((data: boolean) => {
      this.isUploading = data;
    });
  }

  resetValues() {
    this.containerData = {
      name: this.selectedItem,
    };
  }

  onSubmit = (e: any) => {
    e.preventDefault();
    this.fileStore.updateContainer(this.selectedItem, this.containerData.name);
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
