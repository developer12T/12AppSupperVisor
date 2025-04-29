import { createWebHistory, createRouter } from 'vue-router'
import dashboardRoutes from '../routes/dashboard/dashboardRoute'
import adminRoutes from '../routes/admin/adminRoute'
import suppervisorRoutes from '../routes/suppervisor/suppervisorRoute'

const routes = [
  { path: '/', component: () => import('../views/Login.vue') },
  { path: '/test', component: () => import('../views/Test.vue') },
  { path: '/home', component: () => import('../Layout.vue') },
  { path: '/403', component: () => import('../views/403.vue') },
  ...dashboardRoutes,
  ...adminRoutes,
  ...suppervisorRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Add global route guard
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('role')

  if (to.meta.requiresAuth) {
    if (!userRole) {
      return next('/login')
    }

    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
      return next('/403')
    }
  }

  next()
})
export default router
