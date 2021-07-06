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
  items: Array<any>;

  renderItemMenu() {
    if (!this._items) {
      this._items = navigationDoctor.map((item) => {
        if (item.path && !/^\//.test(item.path)) {
          item.path = `/${item.path}`;
        }
        return { ...item, expanded: !this._compactMode };
      });
    }
    this.items = this._items;
  }

  userRoleListener() {
    this.store.$currentRole.subscribe((data: string) => {
      // console.log(data);
      // not switch view?
      if (!this.menu.instance) {
        return;
      }
      switch (data.trim().toLocaleLowerCase()) {
        case 'customer':
          this.menu.instance.option(
            'items',
            navigationCustomer.map((item) => {
              if (item.path && !/^\//.test(item.path)) {
                item.path = `/${item.path}`;
              }
              return { ...item, expanded: !this._compactMode };
            })
          );
          break;
        case 'admin':
          this.menu.instance.option(
            'items',
            navigationAdmin.map((item) => {
              if (item.path && !/^\//.test(item.path)) {
                item.path = `/${item.path}`;
              }
              return { ...item, expanded: !this._compactMode };
            })
          );
          break;
        case 'doctor':
          this.menu.instance.option(
            'items',
            navigationDoctor.map((item) => {
              if (item.path && !/^\//.test(item.path)) {
                item.path = `/${item.path}`;
              }
              return { ...item, expanded: !this._compactMode };
            })
          );
          break;
        case undefined:
          this.menu.instance.option(
            'items',
            navigationDoctor.map((item) => {
              if (item.path && !/^\//.test(item.path)) {
                item.path = `/${item.path}`;
              }
              return { ...item, expanded: !this._compactMode };
            })
          );
          break;
        default:
          this.menu.instance.option(
            'items',
            navigationDoctor.map((item) => {
              if (item.path && !/^\//.test(item.path)) {
                item.path = `/${item.path}`;
              }
              return { ...item, expanded: !this._compactMode };
            })
          );
          break;
      }
    });
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
    this.renderItemMenu();
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
