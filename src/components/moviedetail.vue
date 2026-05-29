<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="movie" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-shell" role="dialog" aria-modal="true">

          <!-- Close -->
          <button class="close-btn" @click="$emit('close')" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Backdrop art -->
          <div class="backdrop-art">
            <img
              :src="backdropSrc"
              :alt="movieTitle"
              class="backdrop-img"
              @error="onBackdropError"
            />
            <div class="backdrop-gradient"></div>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Poster column -->
            <div class="poster-col">
              <div class="poster-frame">
                <img
                  :src="posterSrc"
                  :alt="movieTitle"
                  class="detail-poster"
                  @error="onPosterError"
                />
                <div class="poster-shine"></div>
              </div>
            </div>

            <!-- Info column -->
            <div class="info-col">
              <!-- Title + rating row -->
              <div class="title-row">
                <h2 class="detail-title">{{ movieTitle }}</h2>
                <div v-if="numericRating > 0" class="big-rating" :class="ratingClass">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  {{ displayRating }}
                </div>
              </div>

              <!-- Meta pills -->
              <div class="meta-pills">
                <span v-if="releaseYear" class="pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {{ releaseYear }}
                </span>
                <span v-if="movie.duration || movie.runtime" class="pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ movie.duration || movie.runtime }} min
                </span>
                <span v-if="genreLabel" class="pill accent">{{ genreLabel }}</span>
                <span v-if="movie.language || movie.original_language" class="pill">
                  🌐 {{ (movie.language || movie.original_language || '').toUpperCase() }}
                </span>
              </div>

              <!-- Divider -->
              <div class="divider"></div>

              <!-- Overview -->
              <div class="overview-section">
                <h4 class="section-label">Overview</h4>
                <p class="overview-text">
                  {{ movie.overview || movie.description || movie.synopsis || 'No overview available for this film.' }}
                </p>
              </div>

              <!-- Extra details -->
              <div v-if="hasExtras" class="extras-grid">
                <div v-if="movie.director" class="extra-item">
                  <span class="extra-label">Director</span>
                  <span class="extra-value">{{ movie.director }}</span>
                </div>
                <div v-if="movie.country || movie.production_country" class="extra-item">
                  <span class="extra-label">Country</span>
                  <span class="extra-value">{{ movie.country || movie.production_country }}</span>
                </div>
                <div v-if="movie.status" class="extra-item">
                  <span class="extra-label">Status</span>
                  <span class="extra-value">{{ movie.status }}</span>
                </div>
                <div v-if="movie.budget" class="extra-item">
                  <span class="extra-label">Budget</span>
                  <span class="extra-value">${{ formatMoney(movie.budget) }}</span>
                </div>
              </div>

              <!-- Actors -->
              <div v-if="castList.length" class="cast-section">
                <h4 class="section-label">Cast</h4>
                <div class="cast-list">
                  <div v-for="actor in castList" :key="actor.id || actor.name" class="cast-chip">
                    <img
                      v-if="actor.profile_image_url || actor.image_url"
                      :src="actor.profile_image_url || actor.image_url"
                      :alt="actor.full_name || actor.name"
                      class="cast-avatar"
                      @error="e => (e.target as HTMLImageElement).style.display = 'none'"
                    />
                    <span class="cast-avatar placeholder" v-else>🎭</span>
                    <span>{{ actor.full_name || actor.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="action-row">
                <button class="btn-watch" @click="$emit('close')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Watch Now
                </button>
                <button class="btn-icon" title="Add to Watchlist">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
                <button class="btn-icon" title="Add to Favorites">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <button class="btn-icon" title="Share">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </teleport>
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
  backdrop_url?: string
  backdrop_path?: string
  overview?: string
  description?: string
  synopsis?: string
  genre?: string
  genres?: string[]
  language?: string
  original_language?: string
  runtime?: number
  duration?: number
  director?: string
  country?: string
  production_country?: string
  status?: string
  budget?: number
  actors?: any[]
  cast?: any[]
  [key: string]: any
}

const props = defineProps<{ movie: Movie | null }>()
defineEmits<{ (e: 'close'): void }>()

const posterError = ref(false)
const backdropError = ref(false)

const movieTitle = computed(() => props.movie?.title || props.movie?.name || 'Untitled')

const posterSrc = computed(() => {
  if (!props.movie) return ''
  if (posterError.value) return `https://placehold.co/300x450/0d0d2b/8b5cf6?text=${encodeURIComponent(movieTitle.value)}`
  return props.movie.poster_url || props.movie.poster_path || `https://placehold.co/300x450/0d0d2b/8b5cf6?text=${encodeURIComponent(movieTitle.value)}`
})

const backdropSrc = computed(() => {
  if (!props.movie) return ''
  if (backdropError.value) return posterSrc.value
  return props.movie.backdrop_url || props.movie.backdrop_path || posterSrc.value
})

const numericRating = computed(() => {
  const r = props.movie?.rating ?? props.movie?.vote_average ?? 0
  return typeof r === 'string' ? parseFloat(r) : r
})

const displayRating = computed(() => numericRating.value > 0 ? numericRating.value.toFixed(1) : 'N/A')

const ratingClass = computed(() => {
  const r = numericRating.value
  if (r >= 8) return 'gold'
  if (r >= 6) return 'silver'
  return 'bronze'
})

const releaseYear = computed(() => {
  const d = props.movie?.release_date || props.movie?.first_air_date
  return d ? new Date(d).getFullYear() : null
})

const genreLabel = computed(() => {
  if (!props.movie) return ''
  if (props.movie.genre) return props.movie.genre
  if (props.movie.genres?.length) return Array.isArray(props.movie.genres) ? props.movie.genres[0] : props.movie.genres
  return ''
})

const castList = computed(() => {
  const list = props.movie?.actors || props.movie?.cast || []
  return list.slice(0, 6)
})

const hasExtras = computed(() => {
  const m = props.movie
  return m && (m.director || m.country || m.production_country || m.status || m.budget)
})

function formatMoney(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return n.toString()
}

function onPosterError() { posterError.value = true }
function onBackdropError() { backdropError.value = true }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

/* ── Backdrop ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 2, 15, 0.88);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
}

/* ── Shell ── */
.modal-shell {
  position: relative;
  background: linear-gradient(160deg, #0f0f2e 0%, #080818 100%);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.04);
}

/* ── Close ── */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(10, 10, 30, 0.7);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.2s ease;
}
.close-btn:hover {
  background: rgba(139, 92, 246, 0.3);
  color: #fff;
  transform: scale(1.08);
}

/* ── Backdrop art ── */
.backdrop-art {
  position: relative;
  height: 220px;
  overflow: hidden;
}
.backdrop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: brightness(0.6) saturate(1.1);
}
.backdrop-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 30%, #0f0f2e 100%);
}

/* ── Body ── */
.modal-body {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 28px;
  padding: 0 32px 32px;
  margin-top: -80px;
  position: relative;
  z-index: 2;
}

/* ── Poster col ── */
.poster-col { display: flex; flex-direction: column; align-items: center; }

.poster-frame {
  position: relative;
  width: 160px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 0 2px rgba(139,92,246,0.3);
}

.detail-poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  display: block;
}

.poster-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
  pointer-events: none;
}

/* ── Info col ── */
.info-col {
  padding-top: 90px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* ── Title row ── */
.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.detail-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(26px, 4vw, 40px);
  letter-spacing: 1.5px;
  color: #fff;
  line-height: 1.1;
  margin: 0;
  flex: 1;
}

.big-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 30px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 4px;
}
.big-rating.gold   { background: rgba(234,179,8,0.15);  border: 1px solid rgba(234,179,8,0.4);  color: #fbbf24; }
.big-rating.silver { background: rgba(148,163,184,0.15); border: 1px solid rgba(148,163,184,0.3); color: #cbd5e1; }
.big-rating.bronze { background: rgba(180,83,9,0.15);   border: 1px solid rgba(180,83,9,0.3);   color: #fb923c; }

/* ── Meta pills ── */
.meta-pills { display: flex; gap: 8px; flex-wrap: wrap; }

.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.65);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 4px 12px;
  border-radius: 20px;
}

.pill.accent {
  color: rgba(139,92,246,0.9);
  background: rgba(139,92,246,0.1);
  border-color: rgba(139,92,246,0.25);
}

/* ── Divider ── */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent);
}

/* ── Overview ── */
.section-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(139,92,246,0.8);
  margin: 0 0 8px 0;
}

.overview-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255,255,255,0.72);
  margin: 0;
}

/* ── Extras ── */
.extras-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.extra-item {
  background: rgba(139,92,246,0.06);
  border: 1px solid rgba(139,92,246,0.15);
  border-radius: 10px;
  padding: 10px 14px;
}

.extra-label {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(139,92,246,0.7);
  margin-bottom: 4px;
}

.extra-value {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.85);
}

/* ── Cast ── */
.cast-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cast-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 5px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 30px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: rgba(255,255,255,0.75);
  transition: all 0.2s ease;
}
.cast-chip:hover {
  background: rgba(139,92,246,0.15);
  border-color: rgba(139,92,246,0.3);
  color: #fff;
}

.cast-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
}
.cast-avatar.placeholder {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: rgba(139,92,246,0.1);
}

/* ── Actions ── */
.action-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-watch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border: none;
  border-radius: 40px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(139,92,246,0.35);
}
.btn-watch:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(139,92,246,0.55);
}

.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(139,92,246,0.1);
  border: 1px solid rgba(139,92,246,0.25);
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn-icon:hover {
  background: rgba(139,92,246,0.25);
  border-color: #8b5cf6;
  color: #fff;
  transform: scale(1.08);
}

/* ── Transition ── */
.modal-fade-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.2, 0.64, 1); }
.modal-fade-leave-active { transition: all 0.2s ease; }
.modal-fade-enter-from  { opacity: 0; transform: scale(0.94) translateY(20px); }
.modal-fade-leave-to    { opacity: 0; transform: scale(0.96) translateY(10px); }

/* ── Responsive ── */
@media (max-width: 640px) {
  .modal-backdrop { padding: 12px; align-items: flex-end; }
  .modal-shell { border-radius: 20px 20px 0 0; max-height: 92vh; overflow-y: auto; }
  .modal-body { grid-template-columns: 1fr; gap: 16px; padding: 0 20px 28px; margin-top: 0; }
  .backdrop-art { height: 160px; }
  .poster-col { display: none; }
  .info-col { padding-top: 16px; }
  .extras-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>