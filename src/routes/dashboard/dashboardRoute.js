import Layout from '../../Layout.vue'

const dashboardRoutes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: () => import('../../views/Dashboard.vue'),
        // meta: { mainRoute: true }
        meta: { breadcrumb: 'หน้าแดชบอร์ด' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
    //   {
    //     path: 'detail',
    //     component: () => import('../../views/orders/orderDetail.vue'),
    //     meta: { breadcrumb: 'รายละเอียด' }
    //   },
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

export default dashboardRoutes
