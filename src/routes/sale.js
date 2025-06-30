import Layout from '../Layout.vue'

const saleRoutes = [
  {
    path: '/sale',
    component: Layout,
    meta: {
      requiresAuth: true,
      allowedRoles: [
        'sale',
        'supervisor',
        'admin',
        'dc',
        'area_manager',
        'sale_manager'
      ] // ONLY these roles can access
    },
    children: [
      {
        path: 'manual',
        component: () => import('../views/sale/ManualHandle.vue')
        //   meta: { breadcrumb: 'รายละเอียด' }
      }
    ]
  }
]

export default saleRoutes
