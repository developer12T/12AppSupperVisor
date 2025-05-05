import { createWebHistory, createRouter } from 'vue-router'
import adminRoutes from '../routes/admin/adminRoute'
import suppervisorRoutes from '../routes/suppervisor/suppervisorRoute'
import Dashboard from '../views/Dashboard.vue'
import Layout from '../Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [{ path: '', component: Dashboard }]
  },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/test', component: () => import('../views/Test.vue') },
  { path: '/home', component: () => import('../Layout.vue') },
  { path: '/403', component: () => import('../views/403.vue') },
  ...adminRoutes,
  ...suppervisorRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('role')
  const isAuthenticated = !!userRole // Replace with real auth logic if needed

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // If user is authenticated and tries to access login page
  if (to.path === '/login' && isAuthenticated) {
    return next('/')
  }

  // If route has role restrictions and user doesn't have access
  if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
    return next('/403')
  }

  // Allow access
  next()
})
export default router
