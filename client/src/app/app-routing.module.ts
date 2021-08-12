import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: 'customer_home',
    loadChildren: () =>
      import('./pages/customer/customer_home/customer-home.module').then(
        (m) => m.CustomerHomeModule
      ),
  },
  {
    path: 'doctor_list',
    loadChildren: () =>
      import('./pages/customer/doctor-list/doctor-list.module').then(
        (m) => m.DoctorListModule
      ),
  },
  {
    path: 'medicine_list',
    loadChildren: () =>
      import('./pages/customer/medicine-list/medicine-list.module').then(
        (m) => m.MedicineListModule
      ),
  },
  {
    path: 'health_condition',
    loadChildren: () =>
      import('./pages/customer/health-condition/health-condition.module').then(
        (m) => m.HealthConditionModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'medical_checkup',
    loadChildren: () =>
      import('./pages/customer/medical-checkup/medical-checkup.module').then(
        (m) => m.MedicalCheckupModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'doctor_schedule',
    loadChildren: () =>
      import('./pages/customer/schedule-list/schedule-list.module').then(
        (m) => m.ScheduleListModule
      ),
    canActivate: [AuthGuardService],
  },
  // doctor route
  {
    path: 'doctor_home',
    loadChildren: () =>
      import('./pages/doctor/doctor_home/doctor-home.module').then(
        (m) => m.DoctorHomeModule
      ),
  },
  {
    path: 'edit_medicine_list',
    loadChildren: () =>
      import(
        './pages/doctor/edit-medicine-list/edit-medicine-list.module'
      ).then((m) => m.EditMedicineListModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit_disease_list',
    loadChildren: () =>
      import('./pages/doctor/edit-disease-list/edit-disease-list.module').then(
        (m) => m.EditDiseaseListModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'room_monitor',
    loadChildren: () =>
      import('./pages/doctor/room-monitor/room-monitor.module').then(
        (m) => m.RoomMonitorModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'room/:id',
    loadChildren: () =>
      import(
        './pages/doctor/edit-health-condition-list/edit-health-condition-list.module'
      ).then((m) => m.EditHealthConditionModule),
  },

  {
    path: 'edit_medical_checkup_list',
    loadChildren: () =>
      import(
        './pages/doctor/edit-medical-checkup-list/edit-medical-checkup-list.module'
      ).then((m) => m.EditMedicalCheckupListModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'schedule_list',
    loadChildren: () =>
      import('./pages/doctor/schedule-list/schedule-list.module').then(
        (m) => m.ScheduleListModule
      ),
    canActivate: [AuthGuardService],
  },
  // admin route
  {
    path: 'admin_home',
    loadChildren: () =>
      import('./pages/admin/admin-home/admin-home.module').then(
        (m) => m.AdminHomeModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit_user_list',
    loadChildren: () =>
      import('./pages/admin/edit-user-list/edit-user-list.module').then(
        (m) => m.EditUserListModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit_customer_list',
    loadChildren: () =>
      import('./pages/admin/edit-customer-list/edit-customer-list.module').then(
        (m) => m.EditCustomerModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit_doctor_list',
    loadChildren: () =>
      import('./pages/admin/edit-doctor-list/edit-doctor-list.module').then(
        (m) => m.EditDoctorListModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit_room_list',
    loadChildren: () =>
      import('./pages/admin/edit-room-list/edit-room-list.module').then(
        (m) => m.EditRoomListModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit_bill_list',
    loadChildren: () =>
      import('./pages/admin/edit-bill-list/edit-bill-list.module').then(
        (m) => m.EditBillListModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit_schedule',
    loadChildren: () =>
      import('./pages/admin/edit-schedule/edit-schedule.module').then(
        (m) => m.EditScheduleModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'file_management',
    loadChildren: () =>
      import('./pages/admin/file-management/file-management.module').then(
        (m) => m.FileManagementModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'statistics',
    loadChildren: () =>
      import('./pages/admin/statistics/statistics.module').then(
        (m) => m.StatisticsModule
      ),
    canActivate: [AuthGuardService],
  },
  // other
  {
    path: 'not_found',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('../app/shared/components/login/login.module').then(
        (m) => m.LoginModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./shared/components/sign-up/sign-up.module').then(
        (m) => m.SignUpModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./shared/components/profile/user-profile.module').then(
        (m) => m.UserProfileModule
      ),
  },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'doctor_home',
  // },
  {
    path: '**',
    redirectTo: 'not_found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), DxDataGridModule, DxFormModule],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
