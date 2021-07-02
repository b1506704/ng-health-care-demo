import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditThemeRoutingModule } from './edit-theme-routing.module';
import { EditThemeComponent } from './edit-theme.component';

@NgModule({
  imports: [CommonModule, EditThemeRoutingModule],
  declarations: [EditThemeComponent],
})
export class EditThemeModule {}
