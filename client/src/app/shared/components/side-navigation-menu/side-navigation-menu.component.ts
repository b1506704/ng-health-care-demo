import {
  Component,
  NgModule,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ItemClickEvent } from 'devextreme/ui/tree_view';
import {
  DxTreeViewModule,
  DxTreeViewComponent,
} from 'devextreme-angular/ui/tree-view';
import {
  navigationCustomer,
  navigationAdmin,
  navigationDoctor,
} from '../../../app-navigation';

import * as events from 'devextreme/events';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
})
export class SideNavigationMenuComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  navigation: Array<any> = [];
  // userRole: string = 'Doctor';

  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<ItemClickEvent>();

  @Output()
  openMenu = new EventEmitter<any>();

  constructor(private elementRef: ElementRef, private store: StoreService) {}

  onItemClick(event: ItemClickEvent) {
    this.selectedItemChanged.emit(event);
  }

  userRoleListener() {
    this.store.$currentRole.subscribe((data: any) => {
      console.log(data);
      // not switch view?
      switch (data) {
        case 'Customer':
          this.navigation = navigationCustomer;
          break;
        case 'Admin':
          this.navigation = navigationAdmin;
          break;
        case 'Doctor':
          this.navigation = navigationDoctor;
          break;
        default:
          break;
      }
    });
  }

  private _selectedItem!: String;
  @Input()
  set selectedItem(value: String) {
    this._selectedItem = value;
    if (!this.menu.instance) {
      return;
    }

    this.menu.instance.selectItem(value);
  }

  private _items!: Record<string, unknown>[];
  get items() {
    if (!this._items) {
      this._items = this.navigation.map((item) => {
        if (item.path && !/^\//.test(item.path)) {
          item.path = `/${item.path}`;
        }
        return { ...item, expanded: !this._compactMode };
      });
    }

    return this._items;
  }

  private _compactMode = false;
  @Input()
  get compactMode() {
    return this._compactMode;
  }
  set compactMode(val) {
    this._compactMode = val;

    if (!this.menu.instance) {
      return;
    }

    if (val) {
      this.menu.instance.collapseAll();
    } else {
      this.menu.instance.expandItem(this._selectedItem);
    }
  }

  ngOnInit(): void {
    this.userRoleListener();
  }

  ngAfterViewInit() {
    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.next(e);
    });
  }

  ngOnDestroy() {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }
}

@NgModule({
  imports: [DxTreeViewModule],
  declarations: [SideNavigationMenuComponent],
  exports: [SideNavigationMenuComponent],
})
export class SideNavigationMenuModule {}
