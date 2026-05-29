<template>
  <div class="articles-list">
    <h1>All Articles</h1>
    <div v-for="article in articles" :key="article.id" class="article-item">
      <h2>{{ article.title }}</h2>
      <p>{{ article.excerpt }}</p>
      <router-link :to="/article/${article.id}">Read More</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const articles = ref([])

onMounted(async () => {
  const res = await fetch('/api/v2/articles')
  const data = await res.json()
  articles.value = data.data || []
})
</script>