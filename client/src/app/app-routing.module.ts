import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';

const routes: Routes = [
  {
    path: 'user_home',
    loadChildren: () =>
      import('./pages/customer/user_home/user-home.module').then(
        (m) => m.UserHomeModule
      ),
  },
  {
    path: 'bill_list',
    loadChildren: () =>
      import('./pages/customer/bill-list/bill-list.module').then(
        (m) => m.BillListModule
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
    path: 'medical_list',
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
  },
  {
    path: 'prescription_list',
    loadChildren: () =>
      import(
        './pages/customer/prescription-list/prescription-list.module'
      ).then((m) => m.PrescriptionListModule),
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
  },
  {
    path: 'edit_disease_list',
    loadChildren: () =>
      import('./pages/doctor/edit-disease-list/edit-disease-list.module').then(
        (m) => m.EditDiseaseListModule
      ),
  },
  {
    path: 'edit_health_condition',
    loadChildren: () =>
      import(
        './pages/doctor/edit-health-condition/edit-health-condition.module'
      ).then((m) => m.EditHealthConditionModule),
  },
  {
    path: 'edit_prescription_list',
    loadChildren: () =>
      import(
        './pages/doctor/edit-prescription-list/edit-prescription-list.module'
      ).then((m) => m.EditPrescriptionListModule),
  },
  // admin route
  {
    path: 'admin_home',
    loadChildren: () =>
      import('./pages/admin/admin-home/admin-home.module').then(
        (m) => m.AdminHomeModule
      ),
  },
  {
    path: 'edit_customer_list',
    loadChildren: () =>
      import('./pages/admin/edit-customer-list/edit-customer-list.module').then(
        (m) => m.EditCustomerModule
      ),
  },
  {
    path: 'edit_doctor_list',
    loadChildren: () =>
      import('./pages/admin/edit-doctor-list/edit-doctor-list.module').then(
        (m) => m.EditDoctorListModule
      ),
  },
  {
    path: 'edit_bill_list',
    loadChildren: () =>
      import('./pages/admin/edit-bill-list/edit-bill-list.module').then(
        (m) => m.EditBillListModule
      ),
  },
  {
    path: 'edit_theme',
    loadChildren: () =>
      import('./pages/admin/edit-theme/edit-theme.module').then(
        (m) => m.EditThemeModule
      ),
  },
  {
    path: 'edit_schedule',
    loadChildren: () =>
      import('./pages/admin/edit-schedule/edit-schedule.module').then(
        (m) => m.EditScheduleModule
      ),
  },
  {
    path: 'statistics',
    loadChildren: () =>
      import('./pages/admin/statistics/statistics.module').then(
        (m) => m.StatisticsModule
      ),
  },
  // other
  {
    path: 'not_found',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'user_home',
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
