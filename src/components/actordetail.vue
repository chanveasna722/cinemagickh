<template>
  <div class="actor-detail-modal" @click="$emit('close')">
    <div class="actor-detail-container" @click.stop>
      <button class="close-btn" @click="$emit('close')">✕</button>
      
      <div class="actor-detail-content">
        <div class="actor-detail-header">
          <div class="actor-detail-image">
            <img 
              :src="actor.profile_image_url || actor.image_url || '/placeholder-actor.jpg'" 
              :alt="actor.name || actor.full_name"
              @error="e => e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'"
            >
          </div>
          <div class="actor-detail-info">
            <h1>{{ actor.name || actor.full_name }}</h1>
            
            <div class="actor-detail-meta">
              <span v-if="actor.nationality" class="meta-item">
                <span class="meta-icon">🌍</span>
                {{ actor.nationality }}
              </span>
              <span v-if="actor.birth_date" class="meta-item">
                <span class="meta-icon">🎂</span>
                {{ formatDate(actor.birth_date) }}
              </span>
              <span v-if="actor.known_for" class="meta-item known-badge">
                <span class="meta-icon">⭐</span>
                {{ actor.known_for }}
              </span>
            </div>
            
            <div class="actor-stats" v-if="actor.movie_count || actor.popularity">
              <div v-if="actor.movie_count" class="stat">
                <strong>{{ actor.movie_count }}</strong>
                <span>Movies</span>
              </div>
              <div v-if="actor.popularity" class="stat">
                <strong>{{ actor.popularity }}</strong>
                <span>Popularity</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="actor-detail-bio" v-if="actor.biography">
          <h3>Biography</h3>
          <p>{{ actor.biography }}</p>
        </div>
        
        <div class="actor-detail-bio" v-else>
          <h3>Biography</h3>
          <p class="no-bio">No biography available for this actor.</p>
        </div>
        
        <div class="actor-detail-actions">
          <button class="action-btn" @click="shareActor">
            <span>📤</span> Share
          </button>
          <button class="action-btn" @click="closeModal">
            <span>✕</span> Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Actor {
  id: number
  name?: string
  full_name?: string
  known_for?: string
  nationality?: string
  biography?: string
  birth_date?: string
  profile_image_url?: string
  image_url?: string
  movie_count?: number
  popularity?: number
  [key: string]: any
}

const props = defineProps<{ actor: Actor }>()
const emit = defineEmits(['close'])

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const shareActor = () => {
  if (navigator.share) {
    navigator.share({
      title: props.actor.name || props.actor.full_name,
      text: `Check out ${props.actor.name || props.actor.full_name} on CinemaMagic KH!`,
      url: window.location.href
    }).catch(() => {
      alert(`Share: ${props.actor.name || props.actor.full_name}`)
    })
  } else {
    alert(`Share: ${props.actor.name || props.actor.full_name}`)
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.actor-detail-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.actor-detail-container {
  background: linear-gradient(145deg, rgba(15, 10, 40, 0.98), rgba(10, 10, 30, 0.98));
  border-radius: 28px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(139, 92, 246, 0.3);
  position: relative;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 24px;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(139, 92, 246, 0.3);
  color: white;
  transform: rotate(90deg);
}

.actor-detail-content {
  padding: 32px;
}

.actor-detail-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.actor-detail-image {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(139, 92, 246, 0.5);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.actor-detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.actor-detail-info {
  flex: 1;
}

.actor-detail-info h1 {
  color: white;
  font-size: 32px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.actor-detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 92, 246, 0.1);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.meta-icon {
  font-size: 14px;
}

.known-badge {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.actor-stats {
  display: flex;
  gap: 30px;
  margin-top: 15px;
}

.stat {
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.stat span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.actor-detail-bio {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}

.actor-detail-bio h3 {
  color: white;
  font-size: 20px;
  margin-bottom: 16px;
  display: inline-block;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.actor-detail-bio p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  font-size: 15px;
}

.no-bio {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.actor-detail-actions {
  display: flex;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}

.action-btn {
  flex: 1;
  padding: 12px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.action-btn:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .actor-detail-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .actor-detail-image {
    width: 150px;
    height: 150px;
  }
  
  .actor-detail-info h1 {
    font-size: 24px;
  }
  
  .actor-detail-meta {
    justify-content: center;
  }
  
  .actor-stats {
    justify-content: center;
  }
  
  .actor-detail-content {
    padding: 24px;
  }
}
</style>