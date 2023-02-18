import { createRouter, createWebHashHistory } from 'vue-router'
const modules = import.meta.glob([
  '../views/**/*.vue',
  '../components/**/*.vue'
])

let routes = [
  {
    path: '/test',
    component: modules['../views/TestView.vue']
  },
  {
    path: '/login',
    component: modules['../views/Login/LoginView.vue']
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export { router, routes }
