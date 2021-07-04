export const navigationCustomer = [
  {
    text: 'Home',
    path: '/user_home',
    icon: 'home',
  },
  {
    text: 'Bill',
    path: '/bill_list',
    icon: 'cart',
  },
  {
    text: 'Help Center',
    icon: 'help',
    items: [
      {
        text: 'Doctor',
        path: '/doctor_list',
      },
      {
        text: 'Medical',
        path: '/medical_list',
      },
    ],
  },
  {
    text: 'Heath Care',
    icon: 'like',
    items: [
      {
        text: 'Health Condition',
        path: '/health_condition',
      },
      {
        text: 'Prescription',
        path: '/prescription_list',
      },
    ],
  },
];
export const navigationDoctor = [
  {
    text: 'Home',
    path: '/doctor_home',
    icon: 'home',
  },
  {
    text: 'Medical',
    icon: 'filter',
    items: [
      {
        text: 'Edit Medicine',
        path: '/edit_medicine_list',
      },
      {
        text: 'Edit Disease',
        path: '/edit_disease_list',
      },
    ],
  },
  {
    text: 'Heath Care',
    icon: 'like',
    items: [
      {
        text: 'Monitor Patient',
        path: '/edit_health_condition',
      },
      {
        text: 'Edit Prescription',
        path: '/edit_prescription_list',
      },
    ],
  },
];
export const navigationAdmin = [
  {
    text: 'Home',
    path: '/admin_home',
    icon: 'home',
  },
  {
    text: 'User',
    icon: 'user',
    items: [
      {
        text: 'Edit Customer',
        path: '/edit_customer_list',
      },
      {
        text: 'Edit Doctor',
        path: '/edit_doctor_list',
      },
    ],
  },
  {
    text: 'Edit Schedule',
    path: '/edit_schedule',
    icon: 'event',
  },  
  {
    text: 'Edit Bill',
    path: '/edit_bill_list',
    icon: 'card',
  },
  {
    text: 'Modify Theme',
    path: '/edit_theme',
    icon: 'palette',
  },
  {
    text: 'Statistics',
    path: '/statistics',
    icon: 'chart',
  },
];