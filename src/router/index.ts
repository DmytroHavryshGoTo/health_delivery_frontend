import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/deliveries',
        name: 'Deliveries',
        component: () => import('@/components/Deliveries.vue')
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/components/Users.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      guest: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, _, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token')) {
      next()
      return
    }
    next('/login') 
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token')) {
      next('/')
      return
    }
    next() 
  } else {
    next() 
  }
})
export default router
