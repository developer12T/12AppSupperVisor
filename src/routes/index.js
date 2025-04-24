import { createWebHistory, createRouter } from 'vue-router'
import dashboardRoutes from '../routes/dashboard/dashboardRoute'
import adminRoutes from '../routes/admin/adminRoute'
import suppervisorRoutes from '../routes/suppervisor/suppervisorRoute'

const routes = [
  { path: '/', component: () => import('../views/Login.vue') },
  { path: '/test', component: () => import('../views/Test.vue') },
  { path: '/home', component: () => import('../Layout.vue') },
  ...dashboardRoutes,
  ...adminRoutes,
  ...suppervisorRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
