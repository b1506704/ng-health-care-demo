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
  DxSpeedDialActionModule,
  DxTileViewModule,
} from 'devextreme-angular';
import { UploadToolComponent } from './upload-tool/upload-tool.component';
import { UploadFolderComponent } from './upload-folder/upload-folder.component';
import { UploadBatchComponent } from './upload-batch/upload-batch.component';
import { UpdateFolderComponent } from './update-folder/update-folder.component';

@NgModule({
  imports: [
    CommonModule,
    FileManagementRoutingModule,
    DxFileManagerModule,
    DxPopupModule,
    DxScrollViewModule,
    DxFormModule,
    DxTileViewModule,
    DxAutocompleteModule,
    DxSelectBoxModule,
    DxSpeedDialActionModule
  ],
  declarations: [
    FileManagementComponent,
    UploadToolComponent,
    UploadFolderComponent,
    UploadBatchComponent,
    UpdateFolderComponent,
  ],
})
export class FileManagementModule {}
