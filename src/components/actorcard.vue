<template>
  <div class="actor-card" @click="$emit('click', actor)">
    <div class="actor-image">
      <img 
        :src="actor.profile_image_url || actor.image_url || '/placeholder-actor.jpg'" 
        :alt="actor.name || actor.full_name"
        @error="handleImageError"
      >
      <div class="actor-overlay">
        <span class="view-details">View Details</span>
      </div>
    </div>
    <div class="actor-info">
      <h3 class="actor-name">{{ actor.name || actor.full_name }}</h3>
      <p v-if="actor.known_for" class="actor-known">{{ actor.known_for }}</p>
      <div class="actor-badge">
        <span v-if="actor.nationality" class="nationality">
          <span class="flag">{{ getFlagEmoji(actor.nationality) }}</span>
          {{ actor.nationality }}
        </span>
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
  profile_image_url?: string
  image_url?: string
  [key: string]: any
}

defineProps<{ actor: Actor }>()
defineEmits(['click'])

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/300x300?text=No+Image'
}

const getFlagEmoji = (nationality: string) => {
  const flags: Record<string, string> = {
    'American': '🇺🇸', 'British': '🇬🇧', 'Canadian': '🇨🇦',
    'Australian': '🇦🇺', 'French': '🇫🇷', 'German': '🇩🇪',
    'Italian': '🇮🇹', 'Spanish': '🇪🇸', 'Japanese': '🇯🇵',
    'Korean': '🇰🇷', 'Chinese': '🇨🇳', 'Indian': '🇮🇳',
    'Cambodian': '🇰🇭', 'Thai': '🇹🇭', 'Vietnamese': '🇻🇳'
  }
  return flags[nationality] || '🌍'
}
</script>

<style scoped>
.actor-card {
  cursor: pointer;
  background: linear-gradient(145deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.03));
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.actor-card:hover {
  transform: translateY(-8px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 12px 30px rgba(139, 92, 246, 0.25);
}

.actor-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
}

.actor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.actor-card:hover .actor-image img {
  transform: scale(1.08);
}

.actor-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.actor-card:hover .actor-overlay {
  opacity: 1;
}

.view-details {
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid white;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}

.actor-info {
  padding: 16px;
  text-align: center;
}

.actor-name {
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actor-known {
  color: rgba(139, 92, 246, 0.8);
  font-size: 12px;
  margin: 0 0 8px 0;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actor-badge {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.nationality {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(139, 92, 246, 0.15);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.flag {
  font-size: 12px;
}
</style>