import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/settings",
        name: "Settings",
        component: () => import("@/components/Settings.vue"),
      },
      {
        path: "/deliveries/new",
        name: "NewDelivery",
        component: () => import("@/components/NewDelivery.vue"),
      },
      {
        path: "/deliveries",
        name: "Deliveries",
        component: () => import("@/components/Deliveries.vue"),
      },
      {
        path: "/ads",
        name: "Ads",
        component: () => import("@/components/Ads.vue"),
      },
      {
        path: "/deliveries/:id",
        name: "Delivery",
        component: () => import("@/components/Delivery.vue"),
      },
      {
        path: "/users",
        name: "Users",
        component: () => import("@/components/Users.vue"),
      },
      {
        path: "/iot-simulator",
        name: "IotSimulator",
        component: () => import("@/components/IotSimulator.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: {
      guest: true,
    },
  },
];

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
