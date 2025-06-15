import Layout from '../../Layout.vue'

const adminRoutes = [
  {
    path: '/admin',
    component: Layout,
    meta: {
      requiresAuth: true,
      allowedRoles: ['sale', 'admin', 'master'] // ONLY these roles can access
    },
    children: [
      {
        path: 'product',
        component: () => import('../../views/admin/Product.vue')
        //   meta: { breadcrumb: 'รายละเอียด' }
      },
      {
        path: 'promotion',
        component: () => import('../../views/admin/Promotion.vue')
        // meta: { breadcrumb: 'ใบสั่งจอง' }
      },
      {
        path: 'newpromotion',
        component: () => import('../../views/admin/NewPromotion.vue')
        // meta: { breadcrumb: 'ใบรวมสินค้า' }
      },
      {
        path: 'promotiondetails/:proId',
        component: () => import('../../views/admin/PromotionDetails.vue')
        // meta: { breadcrumb: 'ใบรวมสินค้า' }
      }
    ]
  }
]

export default adminRoutes
