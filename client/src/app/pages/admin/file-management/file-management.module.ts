import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagementRoutingModule } from './file-management-routing.module';
import { FileManagementComponent } from './file-management.component';
import {
  DxAutocompleteModule,
  DxFileManagerModule,
  DxFormModule,
  DxPopupModule,
  DxScrollViewModule,
  DxSelectBoxModule,
} from 'devextreme-angular';
import { UploadToolComponent } from './upload-tool/upload-tool.component';
import { UploadFolderComponent } from './upload-folder/upload-folder.component';

@NgModule({
  imports: [
    CommonModule,
    FileManagementRoutingModule,
    DxFileManagerModule,
    DxPopupModule,
    DxScrollViewModule,
    DxFormModule,
    DxAutocompleteModule,
    DxSelectBoxModule,
  ],
  declarations: [
    FileManagementComponent,
    UploadToolComponent,
    UploadFolderComponent,
  ],
})
export class FileManagementModule {}
