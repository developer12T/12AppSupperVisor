import Layout from '../../Layout.vue'

const adminRoutes = [
  {
    path: '/admin',
    component: Layout,
    meta: {
      requiresAuth: true,
      allowedRoles: [
        'supervisor',
        'admin',
        'dc',
        'area_manager',
        'sale_manager'
      ] // ONLY these roles can access
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
      },
      {
        path: 'user/:username',
        component: () => import('../../views/admin/UserProfile.vue')
        // meta: { breadcrumb: 'ใบรวมสินค้า' }
      },
      {
        path: 'manageuser',
        component: () => import('../../views/admin/ManageUser.vue')
        // meta: { breadcrumb: 'ใบรวมสินค้า' }
      },
      {
        path: 'giveaway',
        component: () => import('../../views/admin/Giveaways.vue')
        // meta: { breadcrumb: 'ใบรวมสินค้า' }
      },
      {
        path: 'giveawayall',
        component: () => import('../../views/admin/GiveawaysAll.vue')
        // meta: { breadcrumb: 'ใบรวมสินค้า' }
      },
      {
        path: 'giveawayall/:giveId',
        name: 'GiveDetail',
        component: () => import('../../views/admin/GiveawysDetail.vue')
        // meta: { breadcrumb: 'ใบรวมสินค้า' }
      },
      {
        path: 'checklist',
        component: () => import('../../views/admin/ChecklistFlow.vue')
        // meta: { breadcrumb: 'ใบรวมสินค้า' }
      },
      {
        path: 'addNewProduct',
        component: () => import('../../views/admin/AddNewProduct.vue')
        // meta: { breadcrumb: 'ใบสั่งจอง' }
      }
    ]
  }
]

export default adminRoutes
