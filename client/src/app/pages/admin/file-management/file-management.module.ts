import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagementRoutingModule } from './file-management-routing.module';
import { FileManagementComponent } from './file-management.component';
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    FileManagementRoutingModule,
    DxFileManagerModule,
    DxPopupModule,
  ],
  declarations: [FileManagementComponent],
})
export class FileManagementModule {}
