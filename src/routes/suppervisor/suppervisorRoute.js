import Layout from '../../Layout.vue'

const suppervisorRoutes = [
  {
    path: '/suppervisor',
    meta: {
      requiresAuth: true,
      allowedRoles: ['sale', 'admin', 'master'] // ONLY these roles can access
    },
    component: Layout,
    children: [
      {
        path: 'approve',
        component: () => import('../../views/suppervisor/Store.vue')
      },
      {
        path: 'checkin',
        component: () => import('../../views/suppervisor/CheckIn.vue')
      },
      {
        path: 'report',
        component: () => import('../../views/suppervisor/Report.vue')
      },
      {
        path: 'product',
        component: () => import('../../views/suppervisor/Product.vue')
      }
    ]
  }
]

export default suppervisorRoutes
