import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: App
  },
  {
    path: '/article/:id',
    name: 'article',
    component: () => import('../components/article.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
