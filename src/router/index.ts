import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import AppLayout from '@/layouts/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
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

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (!auth.loaded) {
    await auth.loadUser()
  }

  if (to.meta.requiresAuth && !auth.user) {
    next('/login')
  } else if (to.path === '/login' && auth.user) {
    next('/home')
  } else {
    next()
  }
})

export default router