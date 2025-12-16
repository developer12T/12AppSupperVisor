import Layout from '../../Layout.vue'

const adminRoutes = [
  {
    path: '/areamanager',
    component: Layout,
    meta: {
      requiresAuth: true,
      allowedRoles: ['supervisor', 'admin', 'area_manager', 'sale_manager'] // ONLY these roles can access
    },
    children: [
      {
        path: 'changeroute',
        component: () => import('../../views/areamanager/ChangeRoute.vue')
        //   meta: { breadcrumb: 'รายละเอียด' }
      },
      {
        path: 'addstoreroute',
        component: () => import('../../views/areamanager/AddStoreRoute.vue')
        //   meta: { breadcrumb: 'รายละเอียด' }
      }
    ]
  }
]

export default adminRoutes
