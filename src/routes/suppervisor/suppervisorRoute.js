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
        //   meta: { breadcrumb: 'รายละเอียด' }
      }
      //   {
      //     path: 'summary',
      //     component: () => import('../../views/orders/orderSummary.vue'),
      //     meta: { breadcrumb: 'ใบสั่งจอง' }
      //   },
      //   {
      //     path: 'summaryAll',
      //     component: () => import('../../views/orders/orderSummaryAll.vue'),
      //     meta: { breadcrumb: 'ใบรวมสินค้า' }
      //   }
    ]
  }
]

export default suppervisorRoutes
