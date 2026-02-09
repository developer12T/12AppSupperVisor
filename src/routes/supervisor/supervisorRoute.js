import Layout from '../../Layout.vue'

const supervisorRoutes = [
  {
    path: '/supervisor',
    meta: {
      requiresAuth: true,
      allowedRoles: [
        'supervisor',
        'admin',
        'dc',
        'area_manager',
        'sale_manager'
      ]
    },
    component: Layout,
    children: [
      {
        path: 'approve',
        component: () => import('../../views/supervisor/Store.vue')
      },
      {
        path: 'approve/:storeid',
        component: () => import('../../views/supervisor/StoreDetail.vue')
      },
      {
        path: 'checkin',
        component: () => import('../../views/supervisor/CheckIn.vue')
      },

      {
        path: 'checkinAll',
        component: () => import('../../views/supervisor/CheckInAll.vue')
      },
      {
        path: 'checkin/:route/:routeId',
        name: 'RouteDetail',
        component: () => import('../../views/supervisor/RouteDetail.vue'),
        props: true // allows useRoute().params.route OR `props: true` to bind as prop
      },
      {
        path: 'checkin/:route/orderDetail/:orderId',
        // name: 'OrderDetail',
        component: () => import('../../views/supervisor/OrderDetail.vue'),
        props: true // allows useRoute().params.route OR `props: true` to bind as prop
      },
      {
        path: 'order/:orderId',
        // name: 'OrderDetail',
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
        component: () => import('../../views/supervisor/SendmoneyTable.vue')
      },
      {
        path: 'withdraw',
        component: () => import('../../views/supervisor/Withdraw.vue')
      },
      {
        path: 'withdraw/:id',
        component: () => import('../../views/supervisor/WithdrawDetail.vue')
      },
      {
        path: 'stock',
        component: () => import('../../views/supervisor/Stock.vue')
      },
      {
        path: 'adjuststock',
        component: () => import('../../views/supervisor/AjustStock.vue')
      },
      {
        path: 'adjuststock/:orderId',
        component: () => import('../../views/supervisor/AjustStockDetail.vue')
      },
      {
        path: 'storemap',
        component: () => import('../../views/supervisor/Googlemap.vue')
      },
      {
        path: 'refund',
        component: () => import('../../views/supervisor/Refund.vue')
      },
      {
        path: 'refund/:orderId',
        component: () => import('../../views/supervisor/RefundDetail.vue')
      },
      {
        path: 'polylineroute',
        component: () => import('../../views/supervisor/PolylineRoute.vue')
      },
      {
        path: 'polylineroute2/:area',
        component: () => import('../../views/supervisor/PolylineRoute2.vue')
      },
      {
        path: 'polylinerouteCredit/:area/:startDate/:endDate',
        name: 'lineCheckinCredit',
        component: () =>
          import('../../views/supervisor/PolylineRouteLineCredit.vue')
      },
      {
        path: 'polylineroute2/:area/:startDate/:endDate',
        name: 'lineCheckin',
        component: () => import('../../views/supervisor/PolylineRouteLine.vue')
      },
      {
        path: 'skuFocusReport/:area/:date',
        name: 'skuFocusReport',
        component: () => import('../../views/supervisor/SKUFocusReport.vue')
      },
      {
        path: 'skuFocusReportTable/:area/:date',
        name: 'skuFocusReportTable',
        component: () => import('../../views/supervisor/SKUFocusReportTable.vue')
      },
      {
        path: 'storeinroute',
        component: () => import('../../views/supervisor/StoreInRoute.vue')
      },
      {
        path: 'order',
        component: () => import('../../views/supervisor/Order.vue')
      },
      {
        path: 'give',
        component: () => import('../../views/supervisor/GiveOrder.vue')
      },
      {
        path: 'give/:orderId',
        component: () => import('../../views/supervisor/GiveOrderDetail.vue')
      },
      {
        path: 'refundtable',
        component: () => import('../../views/supervisor/RefundTable.vue')
      },
      {
        path: 'withdrawtable',
        component: () => import('../../views/supervisor/WithdrawTable.vue')
      },
      {
        path: 'storenewtable',
        component: () => import('../../views/supervisor/StoreNewTable.vue')
      },
      {
        path: 'storetable',
        component: () => import('../../views/supervisor/StoreTable.vue')
      },
      {
        path: 'storedetail/:storeid',
        name: 'StoreDetail',
        component: () => import('../../views/supervisor/StoreDetailAll.vue')
      },
      {
        path: 'credit',
        component: () => import('../../views/supervisor/CreditWithdraw.vue')
      },
      {
        path: 'backorder',
        component: () => import('../../views/supervisor/BackOrder.vue')
      },
      {
        path: 'cartall',
        name: 'CartAll',
        component: () => import('../../views/supervisor/CartAll.vue')
      },
      {
        path: 'cartdeatail',
        name: 'CartDetail',
        component: () => import('../../views/supervisor/CartDetail.vue')
      },
      {
        path: 'storeapprovelatlong',
        component: () =>
          import('../../views/supervisor/ApproveLatLongStore.vue')
      },
      {
        path: 'googleMapDirection',
        name: 'googleMapDirection', // ✅ add this line
        component: () => import('../../views/supervisor/GoogleMapDirection.vue')
      },
      {
        path: 'sentstore',
        name: 'sentStore',
        component: () => import('../../views/supervisor/SentStore.vue')
      },
      {
        path: 'targetvisit',
        component: () => import('../../views/supervisor/TargetVisitRoute.vue')
      },
      {
        path: 'targetvisitstore/:area/:date',
        name: 'targetvisitstore',
        component: () =>
          import('../../views/supervisor/TargetVisitRouteShowStore.vue')
      },
      {
        path: 'targetvisitCR',
        component: () => import('../../views/supervisor/TargetVisitRouteCR.vue')
      },
      {
        path: 'targetvisitstoreCredit/:area/:date',
        name: 'targetvisitstoreCredit',
        component: () =>
          import('../../views/supervisor/TargetVisitRouteShowStoreCredit.vue')
      },
      {
        path: 'approveLockRoute',
        name: 'approveLockRoute',
        component: () => import('../../views/supervisor/ApproveLockRoute.vue')
      },
      {
        path: 'approveLockRoute/:id',
        name: 'approveLockRouteDetail',
        component: () => import('../../views/supervisor/LockRouteDetail.vue')
      }
    ]
  }
]

export default supervisorRoutes
