<template>
  <div class="movie-card" @click="$emit('click', movie)">
    <!-- Glow accent -->
    <div class="card-glow"></div>

    <!-- Poster -->
    <div class="poster-wrap">
      <img
        :src="posterSrc"
        :alt="movieTitle"
        class="poster-img"
        loading="lazy"
        @error="onImgError"
      />
      <div class="poster-overlay"></div>

      <!-- Rating badge -->
      <div class="rating-badge" :class="ratingClass">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        {{ displayRating }}
      </div>

      <!-- Year badge -->
      <div v-if="releaseYear" class="year-badge">{{ releaseYear }}</div>

      <!-- Hover overlay -->
      <div class="hover-overlay">
        <div class="play-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <span class="view-label">View Details</span>
      </div>
    </div>

    <!-- Info -->
    <div class="card-info">
      <h3 class="card-title">{{ movieTitle }}</h3>
      <div class="card-meta">
        <span v-if="movie.genre" class="genre-tag">{{ movie.genre }}</span>
        <span v-else-if="movie.genres?.length" class="genre-tag">{{ movie.genres[0] }}</span>
        <span v-else class="genre-tag">Film</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Movie {
  id: number
  title?: string
  name?: string
  rating?: number | string
  vote_average?: number
  release_date?: string
  first_air_date?: string
  poster_url?: string
  poster_path?: string
  genre?: string
  genres?: string[]
  [key: string]: any
}

const props = defineProps<{ movie: Movie }>()
defineEmits<{ (e: 'click', movie: Movie): void }>()

const hasError = ref(false)

const movieTitle = computed(() => props.movie.title || props.movie.name || 'Untitled')

const posterSrc = computed(() => {
  if (hasError.value) return `https://placehold.co/300x450/0d0d2b/8b5cf6?text=${encodeURIComponent(movieTitle.value)}`
  const url = props.movie.poster_url || props.movie.poster_path
  if (!url) return `https://placehold.co/300x450/0d0d2b/8b5cf6?text=${encodeURIComponent(movieTitle.value)}`
  return url
})

const numericRating = computed(() => {
  const r = props.movie.rating ?? props.movie.vote_average ?? 0
  return typeof r === 'string' ? parseFloat(r) : r
})

const displayRating = computed(() => {
  const r = numericRating.value
  return r && r > 0 ? r.toFixed(1) : 'N/A'
})

const ratingClass = computed(() => {
  const r = numericRating.value
  if (r >= 8) return 'gold'
  if (r >= 6) return 'silver'
  return 'bronze'
})

const releaseYear = computed(() => {
  const d = props.movie.release_date || props.movie.first_air_date
  return d ? new Date(d).getFullYear() : null
})

function onImgError() {
  hasError.value = true
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

.movie-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: #0d0d2b;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
  group: true;
}

.movie-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.4);
}

/* Animated glow on hover */
.card-glow {
  position: absolute;
  inset: -1px;
  border-radius: 17px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0), rgba(59, 130, 246, 0));
  transition: background 0.35s ease;
  z-index: 0;
  pointer-events: none;
}

.movie-card:hover .card-glow {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(59, 130, 246, 0.35));
}

/* Poster */
.poster-wrap {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease, filter 0.35s ease;
  display: block;
}

.movie-card:hover .poster-img {
  transform: scale(1.06);
  filter: brightness(0.55);
}

.poster-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(5, 5, 20, 0.95) 0%, rgba(5, 5, 20, 0.2) 50%, transparent 100%);
  pointer-events: none;
}

/* Rating badge */
.rating-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 30px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
  letter-spacing: 0.3px;
}

.rating-badge.gold {
  background: rgba(234, 179, 8, 0.2);
  border: 1px solid rgba(234, 179, 8, 0.5);
  color: #fbbf24;
}

.rating-badge.silver {
  background: rgba(148, 163, 184, 0.2);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: #cbd5e1;
}

.rating-badge.bronze {
  background: rgba(180, 83, 9, 0.2);
  border: 1px solid rgba(180, 83, 9, 0.4);
  color: #fb923c;
}

/* Year badge */
.year-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  background: rgba(10, 10, 40, 0.7);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
}

/* Hover overlay */
.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

.play-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: white;
}

.movie-card:hover .play-btn {
  transform: scale(1);
}

.view-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

/* Card info */
.card-info {
  padding: 14px 14px 16px;
  position: relative;
  z-index: 1;
}

.card-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
  line-height: 1.35;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.genre-tag {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(139, 92, 246, 0.9);
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}
</style>