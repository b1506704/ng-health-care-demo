export const navigationCustomer = [
  {
    text: 'Home',
    path: '/customer_home',
    icon: 'home',
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
        text: 'Medicine',
        path: '/medicine_list',
      },
    ],
  },
  {
    text: 'Doctor Schedule',
    icon: 'event',
    path: '/doctor_schedule',
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
        text: 'Medical Checkup',
        path: '/medical_checkup',
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
        path: '/room_monitor',
      },
      {
        text: 'Edit Medical Checkup',
        path: '/edit_medical_checkup_list',
      },
    ],
  },
  {
    text: 'Schedule List',
    icon: 'event',
    path: '/schedule_list',
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
        text: 'Edit User',
        path: '/edit_user_list',
      },
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
    text: 'Edit Room',
    path: '/edit_room_list',
    icon: 'toolbox',
  },
  {
    text: 'Edit Bill',
    path: '/edit_bill_list',
    icon: 'cart',
  },
  {
    text: 'Image Storage',
    path: '/file_management',
    icon: 'file',
  },
  {
    text: 'Statistics',
    path: '/statistics',
    icon: 'chart',
  },
];
export const navigationNonUser = [
  {
    text: '',
    path: '',
  },
];
