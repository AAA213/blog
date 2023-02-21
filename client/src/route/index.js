import { createRouter, createWebHashHistory } from 'vue-router'
const modules = import.meta.glob([
  '../views/**/*.vue',
  '../components/**/*.vue'
])

let routes = [
  {
    path: '/',
    component: modules['../views/Home/HomeView.vue']
  },
  {
    path: '/test',
    component: modules['../views/TestView.vue']
  },
  {
    path: '/login',
    component: modules['../views/Login/LoginView.vue']
  },
  {
    path: '/dashboard',
    component: modules['../views/DashBoard/DashBoard.vue'],
    children: [
      {
        path: 'category',
        component: modules['../views/Category/CategoryView.vue']
      },
      {
        path: 'article',
        component: modules['../views/Article/ArticleView.vue']
      },
      {
        path: 'logout',
        redirect: '/login'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export { router, routes }
