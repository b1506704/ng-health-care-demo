import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss'],
})
export class FileManagementComponent implements OnInit {
  //todo: implement CRUD apis
  fileItems: Array<Object> = [
    {
      name: 'Documents',
      isDirectory: true,
      items: [
        {
          name: 'Projects',
          isDirectory: true,
          items: [
            {
              name: 'About.rtf',
              isDirectory: false,
              size: 1024,
            },
            {
              name: 'Passwords.rtf',
              isDirectory: false,
              size: 2048,
            },
          ],
        },
        {
          name: 'About.xml',
          isDirectory: false,
          size: 1024,
        },
        {
          name: 'Managers.rtf',
          isDirectory: false,
          size: 2048,
        },
        {
          name: 'ToDo.txt',
          isDirectory: false,
          size: 3072,
        },
      ],
    },
    {
      name: 'Images',
      isDirectory: true,
      items: [
        {
          name: 'logo.png',
          isDirectory: false,
          size: 20480,
          thumbnail: '../../../../assets/imgs/profile.png',
        },
        {
          name: 'banner.gif',
          isDirectory: false,
          size: 10240,
        },
      ],
    },
    {
      name: 'System',
      isDirectory: true,
      items: [
        {
          name: 'Employees.txt',
          isDirectory: false,
          size: 3072,
        },
        {
          name: 'PasswordList.txt',
          isDirectory: false,
          size: 5120,
        },
      ],
    },
    {
      name: 'Description.rtf',
      isDirectory: false,
      size: 1024,
    },
    {
      name: 'Description.txt',
      isDirectory: false,
      size: 2048,
    },
  ];
  isPopupVisible!: boolean;
  currentFile!: any;
  uploadButtonOption: any = {};

  constructor(private router: Router) {}

  onSelectionChanged(e: any) {
    console.log('SELECTION CHANGED');
    console.log(e);
  }

  onToolbarItemClick(e: any) {
    console.log('TOOLBAR ITEM');
    console.log(e);
  }

  onOptionChanged(e: any) {
    console.log('OPTION CHANGED');
    console.log(e);
  }

  displayImagePopup(e: any) {
    this.currentFile = e.file;
    this.isPopupVisible = true;
  }

  navigateToStatistics() {
    this.router.navigate(['/statistics']);
  }

  ngOnInit(): void {}
}
