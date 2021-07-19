import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomMonitorComponent } from './room-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: RoomMonitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomMonitorRoutingModule {}
