import Layout from '../../Layout.vue'

const adminRoutes = [
  {
    path: '/admin',
    component: Layout,
    children: [
        // {
        //   path: 'product',
        //   component: () => import('../../views/admin/Product.vue'),
        // //   meta: { breadcrumb: 'รายละเอียด' }
        // },
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

export default adminRoutes
