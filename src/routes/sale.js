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
      },
      {
        path: 'order',
        component: () => import('../views/sale/Order.vue')
      },
      {
        path: 'give',
        component: () => import('../views/sale/GiveOrder.vue')
      },
      {
        path: 'refundtable',
        component: () => import('../views/sale/RefundTable.vue')
      },
      {
        path: 'withdrawtable',
        component: () => import('../views/sale/WithdrawTable.vue')
      },
      {
        path: 'order/:orderId',
        name: 'OrderDetail',
        component: () => import('../views/sale/OrderDetail.vue'),
        props: true // allows useRoute().params.route OR `props: true` to bind as prop
      },
      {
        path: 'give/:orderId',
        component: () => import('../views/sale/GiveOrderDetail.vue')
      },
      {
        path: 'refund/:orderId',
        component: () => import('../views/sale/RefundDetail.vue')
      },
      {
        path: 'withdraw/:id',
        component: () => import('../views/sale/WithdrawDetail.vue')
      }
    ]
  }
]

export default saleRoutes
