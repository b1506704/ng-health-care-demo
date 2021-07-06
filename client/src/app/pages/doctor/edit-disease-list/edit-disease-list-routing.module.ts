import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';
import { EditDiseaseListComponent } from './edit-disease-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditDiseaseListComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDiseaseListRoutingModule {}
