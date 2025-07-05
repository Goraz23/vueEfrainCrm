import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import AppLayout from '@/layouts/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (!auth.user) auth.loadUser()
  if (to.meta.requiresAuth && !auth.user) {
    next('/login')
  } else if (to.path === '/login' && auth.user) {
    next('/')
  } else {
    next()
  }
})

export default router