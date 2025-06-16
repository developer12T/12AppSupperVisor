import Layout from '../../Layout.vue'

const supervisorRoutes = [
  {
    path: '/supervisor',
    meta: {
      requiresAuth: true,
      allowedRoles: ['sale', 'admin', 'master'] // ONLY these roles can access
    },
    component: Layout,
    children: [
      {
        path: 'approve',
        component: () => import('../../views/supervisor/Store.vue')
      },
      {
        path: 'checkin',
        component: () => import('../../views/supervisor/CheckIn.vue')
      },
      {
        path: 'checkin/:route/:routeId',
        name: 'RouteDetail',
        component: () => import('../../views/supervisor/RouteDetail.vue'),
        props: true // allows useRoute().params.route OR `props: true` to bind as prop
      },
      {
        path: 'checkin/:route/orderDetail/:orderId',
        name: 'OrderDetail',
        component: () => import('../../views/supervisor/OrderDetail.vue'),
        props: true // allows useRoute().params.route OR `props: true` to bind as prop
      },
      {
        path: 'report',
        component: () => import('../../views/supervisor/Report.vue')
      },
      {
        path: 'product',
        component: () => import('../../views/supervisor/Product.vue')
      },
      {
        path: 'sendmoney',
        component: () => import('../../views/supervisor/Sendmoney.vue')
      }
    ]
  }
]

export default supervisorRoutes
