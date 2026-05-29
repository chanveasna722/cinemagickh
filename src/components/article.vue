<template>
  <div class="article-page">
    <div class="article-container">
      <button class="back-btn" @click="goBack">← Back to Home</button>
      <h1>{{ article.title }}</h1>
      <div class="article-meta">
        <span>By: {{ article.author || 'Admin' }}</span>
        <span>{{ formatDate(article.created_at) }}</span>
        <span class="category">{{ article.type || article.category }}</span>
      </div>
      <div v-if="article.cover_url" class="article-image">
        <img :src="article.cover_url" :alt="article.title">
      </div>
      <div class="article-content" v-html="article.content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const article = ref<any>({})

onMounted(async () => {
  try {
    const res = await fetch(`/api/v2/articles/${route.params.id}`)
    const data = await res.json()
    article.value = data.data || data
  } catch (error) {
    console.error('Error fetching article:', error)
  }
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a, #0f0a28);
  padding: 100px 20px 60px;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(15, 10, 40, 0.9);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.back-btn {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
}

.article-container h1 {
  color: white;
  font-size: 2rem;
  margin-bottom: 20px;
}

.article-meta {
  display: flex;
  gap: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  margin-bottom: 20px;
}

.category {
  background: rgba(139, 92, 246, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  color: #8b5cf6;
}

.article-image {
  margin: 20px 0;
}

.article-image img {
  width: 100%;
  border-radius: 12px;
}

.article-content {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}
</style>
