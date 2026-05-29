import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Article from './components/article.vue'

const routes = [
  {
    path: '/',
    component: App,
    meta: {
      title: 'CinemaMagic KH - Movie Database',
    },
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: Article,
    meta: {
      title: 'Article - CinemaMagic KH',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
