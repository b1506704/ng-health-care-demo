import { Component, NgModule, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { StoreService } from '../../services/store.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  @Input()
  menuItems: any;

  @Input()
  menuMode!: string;

  currentUser: User;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.store.$currentUser.subscribe((data: any) => {
      this.currentUser = data;
    });
  }
}

@NgModule({
  imports: [DxListModule, DxContextMenuModule, CommonModule],
  declarations: [UserPanelComponent],
  exports: [UserPanelComponent],
})
export class UserPanelModule {}
