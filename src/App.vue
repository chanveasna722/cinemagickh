app.vue <template>
  <div class="app">
    <div class="bg-base"></div>

    <!-- Header -->
    <header class="header" :class="{ scrolled: isScrolled }">
      <div class="header-inner">
        <div class="logo" @click="scrollToTop">
          <img src="./assets/image/Logo2.png" alt="CinemaMagic KH" class="logo-image" />
        </div>

        <nav class="nav">
          <a
            v-for="item in navItems"
            :key="item.id"
            href="#"
            class="nav-link"
            :class="{ active: activeFilter === item.filter }"
            @click.prevent="setFilter(item.filter)"
          >
            <span class="nav-label">{{ item.label }}</span>
          </a>
          <div class="nav-highlight" :style="navHighlightStyle"></div>
        </nav>

        <div class="header-actions">
          <button class="icon-btn search-btn" @click="focusSearch">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <div class="profile-wrap">
            <button class="icon-btn profile-btn" @click="toggleAuthModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            <div v-if="authStore.isLoggedIn" class="dropdown">
              <div class="dropdown-user-info">
                <strong>{{ authStore.user?.name || 'User' }}</strong>
                <small>{{ authStore.user?.email }}</small>
              </div>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item" @click.prevent="navigateToProfile">Profile</a>
              <a href="#" class="dropdown-item" @click.prevent="navigateToWatchlist">Watchlist</a>
              <a href="#" class="dropdown-item" @click.prevent="navigateToFavorites">Favorites</a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item logout" @click.prevent="handleLogout">Logout</a>
            </div>
          </div>
        </div>
      </div>

      <button class="mobile-menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
        <span :class="{ active: mobileMenuOpen }"></span>
        <span :class="{ active: mobileMenuOpen }"></span>
        <span :class="{ active: mobileMenuOpen }"></span>
      </button>
    </header>

    <!-- Mobile Navigation Overlay -->
    <transition name="mobile-nav">
      <div v-if="mobileMenuOpen" class="mobile-nav-overlay" @click="mobileMenuOpen = false">
        <nav class="mobile-nav" @click.stop>
          <a
            v-for="item in navItems"
            :key="item.id"
            href="#"
            class="mobile-nav-link"
            :class="{ active: activeFilter === item.filter }"
            @click.prevent="handleMobileClick(item.filter)"
          >
            <span>{{ item.label }}</span>
          </a>
        </nav>
      </div>
    </transition>

    <!-- Hero Section with Slideshow -->
    <section class="hero">
      <!-- Slideshow Images -->
      <div class="slideshow-container">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="slide"
          :class="{ active: currentSlide === index }"
        >
          <img :src="slide.image" :alt="slide.title" class="slide-image">
          <div class="slide-overlay"></div>
        </div>
      </div>

      <!-- Slide Navigation Buttons -->
      <button class="slide-prev" @click="prevSlide">❮</button>
      <button class="slide-next" @click="nextSlide">❯</button>

      <!-- Slide Indicators -->
      <div class="slide-dots">
        <span 
          v-for="(slide, index) in slides" 
          :key="index"
          class="dot"
          :class="{ active: currentSlide === index }"
          @click="currentSlide = index"
        ></span>
      </div>

      <div class="hero-gradient-overlay"></div>
      <div class="hero-content-wrapper">
        <div class="hero-inner">
          <span class="hero-tag">WELCOME TO CINEMAMAGIC-KH</span>
          <!-- <h1>Discover Your<br /><span class="gradient-text">Next Obsession</span></h1> -->
          <!-- <p class="hero-sub">
            "Life is too short to live only one story. Movies give you the chance to live a thousand lives before you
            die just once. That is real magic."
          </p> -->
          <div class="hero-stats">
            <div class="stat">
              <strong>{{ allFilmsCache.length }}+</strong><span>Movies</span>
            </div>
            <div class="stat">
              <strong>{{ averageRating }}</strong><span>Avg Rating</span>
            </div>
            <div class="stat"><strong>24/7</strong><span>Updated</span></div>
          </div>
          <div class="hero-btns">
            <button class="btn-primary" :disabled="loading" @click="refreshFilms">
              <span v-if="loading" class="spinner"></span>
              <span v-else>Explore Now</span>
            </button>
            <button class="btn-secondary" @click="scrollToMovies">Show all</button>
          </div>
        </div>
      </div>

      <div class="hero-scroll-indicator" @click="scrollToMovies">
        <div class="scroll-mouse"></div>
        <div class="scroll-arrow">↓</div>
      </div>
    </section>

    <!-- Search Bar -->
    <div class="search-bar">
      <div class="search-inner">
        <div class="search-row">
          <span class="search-icon">🔍</span>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search by title, genre, or actor..."
            @input="handleSearch"
          />
          <button v-if="searchQuery" class="clear-btn" @click="clearSearch">✕</button>
        </div>
        <div class="chips">
          <button class="chip" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">All</button>
          <button class="chip" :class="{ active: activeFilter === 'top' }" @click="setFilter('top')">Top Rated</button>
          <button class="chip" :class="{ active: activeFilter === 'recent' }" @click="setFilter('recent')">Recent</button>
          <button class="chip" :class="{ active: activeFilter === 'trending' }" @click="setFilter('trending')">Trending</button>
          <button class="chip" :class="{ active: activeFilter === 'actor' }" @click="setFilter('actor')">Actors</button>
          <button class="chip" :class="{ active: activeFilter === 'cinema' }" @click="setFilter('cinema')">🎬 Cinemas</button>
        </div>
      </div>
    </div>

    <!-- ARTICLES SECTION -->
    <div v-if="articles.length > 0 && !['actor', 'cinema', 'community'].includes(activeFilter)" class="articles-section">
      <div class="section-header">
        <h2>Latest Articles</h2>
        <span class="view-all" style="opacity:0.5; cursor:default;">View All →</span>
      </div>
      
      <div v-if="articlesLoading" class="loading">Loading articles...</div>
      
      <div v-else class="articles-grid">
        <div 
          v-for="article in articles.slice(0, 4)" 
          :key="article.id" 
          class="article-card"
          @click="goToArticle(article.id)"
        >
          <div class="article-image">
            <img 
              :src="article.cover_url || '/placeholder-article.jpg'" 
              :alt="article.title"
              @error="e => e.target.src = '/placeholder-article.jpg'"
            >
            <span class="article-category">{{ article.type || article.category || 'News' }}</span>
          </div>
          <div class="article-content">
            <h3>{{ truncateText(article.title, 60) }}</h3>
            <p>{{ truncateText(article.excerpt || article.content, 80) }}</p>
            <div class="article-meta">
              <span>📅 {{ formatDate(article.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main ref="moviesSection" class="main">
      <div v-if="error" class="error-toast">
        <span>⚠️ {{ error }}</span>
        <button @click="error = ''">✕</button>
      </div>

      <!-- Cinema Showtime Section -->
      <div v-if="activeFilter === 'cinema'" class="cinema-section">
        <CinemaShowtime @book-ticket="handleBookTicket" />
      </div>

      <!-- Community Section -->
      <div v-else-if="activeFilter === 'community'" class="community-section">
        <div class="community-header">
          <h1>🎬 Join the CinemaMagic Community</h1>
          <p>Connect with fellow movie lovers, discuss your favorite films, and stay updated</p>
        </div>

        <div class="community-grid">
          <div class="community-card telegram-card">
            <div class="card-icon">💬</div>
            <h2>Telegram Group</h2>
            <p>នៅក្នុងក្រុមពិភាក្សាផ្ទាល់(Real-time)របស់យើង ដែលជាកន្លែងអ្នកស្រឡាញ់ភាពយន្តជជែកគ្នាជារៀងរាល់ថ្ងៃអំពីខ្សែភាពយន្ត តារាសម្តែង និងការណែនាំភាពយន្តល្អៗ</p>
            <div class="card-features">
              <span>✅ Real-time chat</span>
              <span>✅ Voice discussions</span>
              <span>✅ Movie polls</span>
              <span>✅ Spoiler warnings</span>
            </div>
            <a :href="telegramLink" target="_blank" rel="noopener noreferrer" class="join-btn telegram-btn">📱 Join Telegram Group</a>
            <p class="member-count">👥 Join the conversation</p>
          </div>

          <div class="community-card discord-card">
            <div class="card-icon">🎮</div>
            <h2>Discord Server</h2>
            <p>ដែលបានរៀបចំសម្រាប់មើលភាពយន្ត​ និងការជជែកគ្នា ។</p>
            <div class="card-features">
              <span>Voice channels</span>
              <span>Watch parties</span>
              <span>Genre rooms</span>
              <span>Bot commands</span>
            </div>
            <a :href="discordLink" target="_blank" rel="noopener noreferrer" class="join-btn discord-btn">🎙️ Join Discord Server</a>
            <p class="member-count">Coming soon</p>
          </div>
        </div>

        <div class="guidelines-section">
          <h2>📋 Community Guidelines</h2>
          <div class="guidelines-grid">
            <div class="guideline">
              <span class="guideline-icon"></span>
              <h3>Stay On Topic</h3>
              <p>Keep discussions related to movies, actors, and cinema</p>
            </div>
            <div class="guideline">
              <span class="guideline-icon"></span>
              <h3>Be Respectful</h3>
              <p>No hate speech, bullying, or personal attacks</p>
            </div>
            <div class="guideline">
              <span class="guideline-icon"></span>
              <h3>No Spoilers</h3>
              <p>Use spoiler tags or warnings for recent releases</p>
            </div>
            <div class="guideline">
              <span class="guideline-icon"></span>
              <h3>Engage Positively</h3>
              <p>Share recommendations, not just criticisms</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actor Grid -->
      <div v-else-if="activeFilter === 'actor' && filteredActors.length > 0" class="movies-grid">
        <ActorCard v-for="actor in filteredActors" :key="actor.id" :actor="actor" @click="showActorDetail(actor)" />
      </div>

      <!-- Actor No Results -->
      <div v-else-if="activeFilter === 'actor' && filteredActors.length === 0 && actors.length > 0 && !loading" class="state-box">
        <div class="state-icon">🔍</div>
        <h3>No Actors Found</h3>
        <p>No actors matching "{{ searchQuery }}"</p>
        <button class="btn-primary small" @click="clearSearch">Clear Search</button>
      </div>

      <!-- Actor No Data -->
      <div v-else-if="activeFilter === 'actor' && actors.length === 0 && !loading" class="state-box">
        <div class="state-icon">🎭</div>
        <h3>No Actors Found</h3>
        <p>Unable to load actors at this moment</p>
      </div>

      <!-- Movies Grid -->
      <div v-else-if="filteredFilms.length > 0 && !['actor', 'community', 'cinema'].includes(activeFilter)" class="movies-grid">
        <MovieCard v-for="movie in filteredFilms" :key="movie.id" :movie="movie" @click="showMovieDetail(movie)" />
      </div>

      <!-- Pagination -->
      <div v-if="!['actor', 'community', 'cinema'].includes(activeFilter) && totalPages > 1 && !loading && allFilmsCache.length > 0" class="pagination-wrapper">
        <div class="pagination">
          <button class="pagination-btn prev" :disabled="currentPage === 1" @click="goToPrevPage">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span class="btn-text">Previous</span>
          </button>

          <div class="pagination-pages">
            <template v-for="page in getPageNumbers()" :key="page">
              <button v-if="page !== '...'" class="page-number" :class="{ active: currentPage === page }" @click="goToPage(page as number)">
                {{ page }}
              </button>
              <span v-else class="page-ellipsis">...</span>
            </template>
          </div>

          <button class="pagination-btn next" :disabled="currentPage === totalPages" @click="goToNextPage">
            <span class="btn-text">Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div class="pagination-info">
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <span class="separator">•</span>
          <span>{{ totalItems }} total movies</span>
        </div>
      </div>

      <!-- Items per page -->
      <div v-if="!['actor', 'community', 'cinema'].includes(activeFilter) && allFilmsCache.length > 0" class="per-page-selector">
        <label>Show:</label>
        <select v-model="itemsPerPage" @change="onItemsPerPageChange">
          <option :value="12">12 per page</option>
          <option :value="24">24 per page</option>
          <option :value="48">48 per page</option>
        </select>
      </div>

      <!-- No Results -->
      <div v-else-if="!loading && filteredFilms.length === 0 && allFilmsCache.length > 0 && !['actor', 'community', 'cinema'].includes(activeFilter)" class="state-box">
        <div class="state-icon">🔍</div>
        <h3>No Results</h3>
        <p>Nothing found for "{{ searchQuery }}"</p>
        <button class="btn-primary small" @click="clearSearch">Clear Search</button>
      </div>

      <!-- Loading -->
      <div v-if="loading && allFilmsCache.length === 0 && !['community', 'cinema'].includes(activeFilter)" class="state-box">
        <div class="spinner large"></div>
        <p>Loading movies...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="!loading && allFilmsCache.length === 0 && !['actor', 'community', 'cinema'].includes(activeFilter)" class="state-box">
        <div class="state-icon">🎬</div>
        <h3>Ready for Movie Magic?</h3>
        <p>Click Explore Now to start browsing</p>
      </div>
    </main>

    <!-- Scroll to Top -->
    <button v-if="showScrollTop" class="scroll-top-btn" @click="scrollToTop">↑</button>

    <!-- Modals -->
    <MovieDetail v-if="selectedMovie" :movie="selectedMovie" @close="closeMovieDetail" />
    <ActorDetail v-if="selectedActor" :actor="selectedActor" @close="closeActorDetail" />

    <LoginModal
      v-if="showAuthModal"
      @close="showAuthModal = false"
      @login-success="handleLoginSuccess"
      @switch-to-signup="showAuthModal = false; showSignupModal = true"
    />

    <SignupModal
      v-if="showSignupModal"
      @close="showSignupModal = false"
      @switch-to-login="showSignupModal = false; showAuthModal = true"
    />

    <TicketBookingModal
      v-if="showBookingModal"
      :visible="showBookingModal"
      :movie="selectedMovieForBooking"
      :cinema="selectedCinema"
      :selected-time="selectedShowtime"
      @close="closeBookingModal"
      @confirm="confirmBooking"
    />

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-icon">🎬</span>
            <span>CinemaMagic KH</span>
          </div>
          <p>Experience the magic of cinema with curated movie collections, actor insights, and a vibrant community of film lovers.</p>
          <div class="footer-social">
            <a href="#" class="social-link" aria-label="Facebook" @click.prevent="socialLinkClick('Facebook')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter" @click.prevent="socialLinkClick('Twitter')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Instagram" @click.prevent="socialLinkClick('Instagram')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Telegram" @click.prevent="socialLinkClick('Telegram')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.08 4.62l-3.6 13.28c-.33 1.1-.9 1.36-1.82.85l-5-3.68-2.4 2.31c-.27.27-.5.5-1.02.5l.36-5.17 9.43-8.53c.41-.36-.09-.56-.63-.2l-11.66 7.33L2.8 10.6c-1.06-.33-1.08-1.06.22-1.57l18.28-7.04c.88-.37 1.66.22 1.38 1.63z" />
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-links">
          <div class="link-col">
            <h4>Explore</h4>
            <ul>
              <li><a href="#" @click.prevent="setFilter('all')">Movies</a></li>
              <li><a href="#" @click.prevent="setFilter('cinema')">Cinemas</a></li>
              <li><a href="#" @click.prevent="setFilter('actor')">Actors</a></li>
              <li><a href="#">Coming Soon</a></li>
            </ul>
          </div>
          <div class="link-col">
            <h4>Community</h4>
            <ul>
              <li><a href="#" @click.prevent="setFilter('community')">Discussion</a></li>
              <li><a href="#">Reviews</a></li>
              <li><a href="#" @click.prevent="authStore.isLoggedIn ? navigateToWatchlist() : toggleAuthModal()">Watchlist</a></li>
              <li><a href="#" @click.prevent="authStore.isLoggedIn ? navigateToFavorites() : toggleAuthModal()">Favorites</a></li>
            </ul>
          </div>
          <div class="link-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">API Docs</a></li>
              <li><a href="#">Report Issue</a></li>
            </ul>
          </div>
          <div class="link-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Disclaimer</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>© 2024 CinemaMagic KH. All rights reserved.</p>
          <p class="made-with">Made with <span class="heart">❤️</span> for movie lovers in Cambodia</p>
        </div>
        <div class="footer-badges">
          <span class="badge">🎬 1000+ Movies</span>
          <span class="badge">⭐ 4.8 Avg Rating</span>
          <span class="badge">🌐 24/7 Updates</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import movieApi from './api/modules/movies'
import articleApi from './api/modules/article'
import actorApi from './api/modules/actors'
import LoginModal from './components/loginmodal.vue'
import SignupModal from './components/signupmodal.vue'
import MovieCard from './components/moviecard.vue'
import MovieDetail from './components/moviedetail.vue'
import ActorCard from './components/actorcard.vue'
import Article from './components/article.vue'
import ArticlesList from './components/articleslist.vue'
import ActorDetail from './components/actordetail.vue'
import CinemaShowtime from './components/cinemashowtime.vue'
import TicketBookingModal from './components/ticketbookingmodal.vue'
import { useAuthStore } from './stores/auth'

// Types
interface Movie {
  id: number
  title?: string
  name?: string
  rating?: number
  vote_average?: number
  release_date?: string
  first_air_date?: string
  poster_url?: string
  poster_path?: string
  [key: string]: any
}

interface Actor {
  id: number
  full_name?: string
  name?: string
  known_for?: string
  nationality?: string
  profile_image_url?: string
  image_url?: string
  biography?: string
  bio?: string
  [key: string]: any
}

// State
const films = ref<Movie[]>([])
const actors = ref<Actor[]>([])
const selectedMovie = ref<Movie | null>(null)
const selectedActor = ref<Actor | null>(null)
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const activeFilter = ref('all')
const isScrolled = ref(false)
const showScrollTop = ref(false)
const searchInput = ref<HTMLInputElement>()
const moviesSection = ref<HTMLElement>()
const mobileMenuOpen = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = ref(12)
const totalItems = ref(0)
const allFilmsCache = ref<Movie[]>([])

// Articles State
const articles = ref<any[]>([])
const articlesLoading = ref(false)

// ✅ Slideshow State - ADD THIS
const slides = ref([
  {
    image: 'https://images.ctfassets.net/4cd45et68cgf/2lpiiOM2mERnl1PG7CBLcr/5b422c37d1ae1dfd8f05f30b52bb1636/Hero_Image_kc.jpg?w=2000',
    title: 'Cinema Experience',
    description: 'Immerse yourself in the magic of the big screen.',
    link: '/movies'
  },
  {
    image: 'https://d9s3e2ooa0od7.cloudfront.net/assets/michael/5d698ff6-06bd-4139-a20d-06f9debdc31a/5d698ff6-06bd-4139-a20d-06f9debdc31a.jpg',
    title: 'Movie Night',
    description: 'Discover your next favorite film.',
    link: '/movies'
  },
  {
    image: 'https://ntvb.tmsimg.com/assets/p32399127_v_h8_aa.jpg?w=1280&h=720',
    title: 'Film Magic',
    description: 'Where stories come to life.',
    link: '/movies'
  },
    {
    image: 'https://m.media-amazon.com/images/M/MV5BODNmYzFhNjYtOTZkYi00MjFiLTgxMmYtN2NiN2YwODgxZTEyXkEyXkFqcGc@._V1_.jpg',
    title: 'Film Magic',
    description: 'Where stories come to life.',
    link: '/movies'
  },
  {
    image: 'https://www.viu.com/ott/viuscene/wp-content/uploads/2024/09/Back-in-Time-to-Save-Him-Lovely-Runners-Time-Travel-Romance-.jpg',
    title: 'Lights, Camera, Action!',
    description: 'Explore the world of cinema.',
    link: '/movies'
  }
  
])

const currentSlide = ref(0)
let slideInterval: ReturnType<typeof setInterval> | null = null

// Booking
const showBookingModal = ref(false)
const selectedMovieForBooking = ref<Movie | null>(null)
const selectedCinema = ref<any>(null)
const selectedShowtime = ref('')

// Community
const telegramLink = ref('https://t.me/your_actual_group_link')
const discordLink = ref('https://discord.gg/your_actual_invite_link')

// Auth
const authStore = useAuthStore()
const showAuthModal = ref(false)
const showSignupModal = ref(false)

const router = useRouter()

// Nav Items
const navItems = [
  { id: 1, label: 'Home', filter: 'all' },
  { id: 2, label: 'Actors', filter: 'actor' },
  { id: 3, label: 'Movies', filter: 'top' },
  { id: 4, label: 'Cinemas', filter: 'cinema' },
  { id: 5, label: 'Community', filter: 'community' },
]

// Computed
const filteredFilms = computed(() => films.value)

const filteredActors = computed(() => {
  if (!searchQuery.value) return actors.value
  const q = searchQuery.value.toLowerCase()
  return actors.value.filter(actor => {
    const name = (actor.full_name || actor.name || '').toLowerCase()
    const knownFor = (actor.known_for || '').toLowerCase()
    const nationality = (actor.nationality || '').toLowerCase()
    return name.includes(q) || knownFor.includes(q) || nationality.includes(q)
  })
})

const averageRating = computed(() => {
  if (!allFilmsCache.value.length) return 'N/A'
  let sum = 0, count = 0
  allFilmsCache.value.forEach(m => {
    const r = typeof m.rating === 'string' ? parseFloat(m.rating) : (m.rating || m.vote_average || 0)
    if (!isNaN(r) && r > 0) { sum += r; count++ }
  })
  return count === 0 ? 'N/A' : (sum / count).toFixed(1)
})

const navHighlightStyle = computed(() => {
  const idx = navItems.findIndex(item => item.filter === activeFilter.value)
  if (idx === -1) return { opacity: 0, transform: 'translateX(0px)', width: '0px' }
  const gap = 8
  return {
    transform: `translateX(calc(${idx * 100}% + ${idx * gap}px))`,
    width: `calc((100% - ${(navItems.length - 1) * gap}px) / ${navItems.length})`,
    opacity: 1,
  }
})

// ✅ Slideshow Functions - ADD THESE
const startAutoSlide = () => {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

// Utilities
function extractArrayFromResponse(response: any): any[] {
  if (!response) return []
  if (Array.isArray(response)) return response
  if (response.data && Array.isArray(response.data)) return response.data
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data

  const keys = ['actors', 'movies', 'films', 'items', 'results', 'records', 'list', 'rows', 'content']
  for (const key of keys) {
    if (Array.isArray(response[key])) return response[key]
    if (response.data && Array.isArray(response.data[key])) return response.data[key]
  }

  if (typeof response === 'object') {
    for (const key in response) {
      if (Array.isArray(response[key]) && response[key].length > 0) {
        const first = response[key][0]
        if (first?.id || first?.title || first?.name || first?.full_name) return response[key]
      }
    }
  }

  console.warn('Could not extract array from response:', response)
  return []
}

function normalizeMovie(movie: any): Movie {
  const rating = typeof movie.rating === 'string' ? parseFloat(movie.rating) : (movie.rating || movie.vote_average || 0)
  return {
    ...movie,
    id: movie.id,
    title: movie.title || movie.name || 'Untitled',
    name: movie.name || movie.title,
    rating,
    vote_average: rating,
    release_date: movie.release_date,
    poster_url: movie.poster_url || movie.poster_path,
    poster_path: movie.poster_url || movie.poster_path,
  }
}

function normalizeActor(actor: any): Actor {
  return {
    ...actor,
    id: actor.id,
    full_name: actor.full_name || actor.name,
    name: actor.name || actor.full_name,
    profile_image_url: actor.profile_image_url || actor.image_url,
  }
}

// API
let isFetching = false

async function fetchAllFilms() {
  if (isFetching) return
  isFetching = true
  loading.value = true
  error.value = ''

  try {
    const response = await movieApi.list({ limit: 100, per_page: 100, page: 1, all: true })
    let filmsArray = extractArrayFromResponse(response)

    if (filmsArray.length === 100) {
      const r2 = await movieApi.list({ page: 2, limit: 100 })
      const a2 = extractArrayFromResponse(r2)
      filmsArray = [...filmsArray, ...a2]

      if (a2.length === 100) {
        const r3 = await movieApi.list({ page: 3, limit: 100 })
        filmsArray = [...filmsArray, ...extractArrayFromResponse(r3)]
      }
    }

    if (!filmsArray.length) {
      allFilmsCache.value = []
      films.value = []
      return
    }

    const normalized = filmsArray.map(normalizeMovie)
    allFilmsCache.value = normalized.filter((m, i, self) => i === self.findIndex(x => x.id === m.id))
    console.log('📦 Total unique films:', allFilmsCache.value.length)
    applyFiltersAndUpdateDisplay()
  } catch (err: any) {
    console.error('Error fetching films:', err)
    error.value = err.message || 'Failed to load films'
    allFilmsCache.value = []
    films.value = []
  } finally {
    loading.value = false
    isFetching = false
  }
}

function applyFiltersAndUpdateDisplay() {
  let filtered = [...allFilmsCache.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m => (m.title || m.name || '').toLowerCase().includes(q))
  }

  if (activeFilter.value === 'top') {
    filtered.sort((a, b) => {
      const ra = typeof a.rating === 'string' ? parseFloat(a.rating) : (a.rating || a.vote_average || 0)
      const rb = typeof b.rating === 'string' ? parseFloat(b.rating) : (b.rating || b.vote_average || 0)
      return rb - ra
    })
  }

  if (activeFilter.value === 'recent') {
    filtered.sort((a, b) => {
      const da = new Date(a.release_date || a.first_air_date || 0).getTime()
      const db = new Date(b.release_date || b.first_air_date || 0).getTime()
      return db - da
    })
  }

  totalItems.value = filtered.length
  totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value) || 1

  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }

  const start = (currentPage.value - 1) * itemsPerPage.value
  films.value = filtered.slice(start, start + itemsPerPage.value)
  console.log(`Page ${currentPage.value}: showing ${films.value.length} of ${totalItems.value} films`)
}

async function fetchActors() {
  try {
    const response = await actorApi.list()
    const arr = extractArrayFromResponse(response)
    actors.value = arr.length ? arr.map(normalizeActor) : []
    if (!arr.length) error.value = 'No actors found'
  } catch (err: any) {
    console.error('Error fetching actors:', err)
    error.value = err.message || 'Failed to load actors'
    actors.value = []
  }
}

const fetchArticles = async () => {
  articlesLoading.value = true
  try {
    const response = await fetch('/api/v2/articles?limit=4')
    const data = await response.json()
    articles.value = data.data || []
  } catch (error) {
    console.error('Error fetching articles:', error)
  } finally {
    articlesLoading.value = false
  }
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

const truncateText = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (date: string) => {
  if (!date) return 'Recent'
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - d.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return `${d.getMonth() + 1}/${d.getDate()}`
}

// Pagination
function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    applyFiltersAndUpdateDisplay()
    moviesSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function goToPrevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    applyFiltersAndUpdateDisplay()
    moviesSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    applyFiltersAndUpdateDisplay()
    moviesSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function getPageNumbers(): (number | string)[] {
  const total = totalPages.value
  const current = currentPage.value
  const pages: (number | string)[] = []

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', total)
  } else if (current >= total - 2) {
    pages.push(1, '...', total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }

  return pages
}

function onItemsPerPageChange() {
  currentPage.value = 1
  applyFiltersAndUpdateDisplay()
}

function handleSearch() {
  currentPage.value = 1
  applyFiltersAndUpdateDisplay()
}

function refreshFilms() {
  allFilmsCache.value = []
  fetchAllFilms()
}

// Actor Detail
async function showActorDetail(actor: Actor) {
  if (!actor) return

  selectedActor.value = {
    id: actor.id,
    name: actor.full_name || actor.name || 'Unknown',
    full_name: actor.full_name || actor.name,
    biography: actor.biography || actor.bio || 'No biography available',
    profile_image_url: actor.profile_image_url || actor.image_url,
    nationality: actor.nationality,
    nationality_flag: actor.nationality_flag,
    known_for: actor.known_for,
    gender: actor.gender,
  }

  try {
    const response = await actorApi.detail(actor.id)
    let detail: any = null

    if (response && !Array.isArray(response) && typeof response === 'object') {
      if (response.id && String(response.id) === String(actor.id)) detail = response
      else if (response.data?.id) detail = response.data
      else if (response.data?.data?.id) detail = response.data.data
    } else if (Array.isArray(response)) {
      detail = response.find((a: Actor) => String(a.id) === String(actor.id)) || response[0]
    }

    if (detail && selectedActor.value) {
      selectedActor.value = {
        ...selectedActor.value,
        biography: detail.biography || detail.bio || selectedActor.value.biography,
        birth_date: detail.birth_date || detail.birthday,
        place_of_birth: detail.place_of_birth || detail.birthplace,
        ...detail,
      }
    }
  } catch (err) {
    console.error('Error loading actor details:', err)
    if (selectedActor.value) selectedActor.value.biography = 'Unable to load detailed biography'
  }
}

// Booking
function handleBookTicket(event: any) {
  const data = event.detail || event
  if (data.movie && data.cinema && data.time) {
    selectedMovieForBooking.value = data.movie
    selectedCinema.value = data.cinema
    selectedShowtime.value = data.time
    showBookingModal.value = true
  }
}

function closeBookingModal() {
  showBookingModal.value = false
  selectedMovieForBooking.value = null
  selectedCinema.value = null
  selectedShowtime.value = ''
}

function confirmBooking(bookingData: any) {
  console.log('Booking confirmed:', bookingData)
  alert(`Booking confirmed!\n\nMovie: ${bookingData.movie?.title}\nTime: ${bookingData.time}\nSeats: ${bookingData.seats?.join(', ')}\nTotal: $${bookingData.total}\nBooking ID: ${bookingData.bookingId}`)
  closeBookingModal()
}

// Actions
function setFilter(f: string) {
  activeFilter.value = f
  currentPage.value = 1
  if (!['actor', 'cinema', 'community'].includes(f)) applyFiltersAndUpdateDisplay()
  if (window.innerWidth <= 768) mobileMenuOpen.value = false
}

function handleMobileClick(filter: string) {
  setFilter(filter)
  mobileMenuOpen.value = false
}

function clearSearch() {
  searchQuery.value = ''
  currentPage.value = 1
  applyFiltersAndUpdateDisplay()
}

function showMovieDetail(movie: Movie) { selectedMovie.value = movie }
function closeMovieDetail() { selectedMovie.value = null }
function closeActorDetail() { selectedActor.value = null }
function focusSearch() { searchInput.value?.focus() }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
function scrollToMovies() { moviesSection.value?.scrollIntoView({ behavior: 'smooth' }) }
function socialLinkClick(platform: string) { console.log(`Opening ${platform} page`) }

// Auth
function toggleAuthModal() {
  if (authStore.isLoggedIn) return
  showAuthModal.value = true
}

function handleLoginSuccess(user: any) {
  console.log('Logged in as:', user?.name || 'User')
  showAuthModal.value = false
  if (user?.role_id === 1) {
    router.push('/dashboard').catch(() => {})
  }
}

async function handleLogout() {
  try {
    authStore.logout()
    window.location.reload()
  } catch (err) {
    console.error('Logout error:', err)
  }
}

function navigateToProfile() { router.push('/profile').catch(() => {}) }
function navigateToWatchlist() { router.push('/watchlist').catch(() => {}) }
function navigateToFavorites() { router.push('/favorites').catch(() => {}) }

// Image Preloading
function preloadVisibleImages() {
  filteredActors.value.slice(0, 12).forEach(actor => {
    if (actor?.profile_image_url) {
      const img = new Image()
      img.src = actor.profile_image_url
    }
  })
}

watch(filteredActors, () => nextTick(preloadVisibleImages), { immediate: true })

// Scroll / Resize
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  showScrollTop.value = window.scrollY > 500
}

const handleResize = () => {
  if (window.innerWidth > 768) mobileMenuOpen.value = false
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  fetchAllFilms()
  fetchActors()
  fetchArticles()
  startAutoSlide() // ✅ ADD THIS
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  if (slideInterval) clearInterval(slideInterval) // ✅ ADD THIS
})
</script>


<style scoped>
/* ─── RESET & BASE ─────────────────────────────────── */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #fff;
  overflow-x: hidden;
}

.bg-base {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at 30% 40%, #1a0533 0%, #0a0a2a 40%, #050514 100%);
  z-index: -2;
}

.bg-base::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 60%, rgba(100, 50, 200, 0.15) 0%, rgba(0, 100, 200, 0.1) 50%, transparent 100%);
  z-index: -1;
}

/* ─── HEADER ─────────────────────────────────────── */
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  transition: all 0.3s ease;
}

.header.scrolled {
  background: rgba(10, 5, 30, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: clamp(3rem, 10vw, 8rem);
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-self: start;
  height: 70px;
}

.logo-image {
  height: 200px;
  width: auto;
  max-width: 300px;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.5));
  transition: transform 0.2s ease, filter 0.2s ease;
}

.logo:hover .logo-image {
  transform: scale(1.05);
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.8));
}

/* ─── NAVIGATION ─────────────────────────────────── */
.nav {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, auto);
  gap: 8px;
  background: rgba(139, 92, 246, 0.08);
  border-radius: 60px;
  padding: 6px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  justify-self: center;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 28px;
  border-radius: 50px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  z-index: 2;
  letter-spacing: 0.3px;
  text-align: center;
}

.nav-link.active {
  color: #fff;
}

.nav-highlight {
  position: absolute;
  height: calc(100% - 12px);
  top: 6px;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border-radius: 50px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  box-shadow: 0 2px 12px rgba(139, 92, 246, 0.4);
  pointer-events: none;
}

/* ─── HEADER ACTIONS ────────────────────────────── */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  justify-self: end;
}

.icon-btn {
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.25);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-btn:hover {
  background: rgba(139, 92, 246, 0.25);
  border-color: #8b5cf6;
  transform: scale(1.08);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.profile-wrap {
  position: relative;
}

.dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: rgba(20, 10, 50, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  overflow: hidden;
  min-width: 200px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px) scale(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.profile-wrap:hover .dropdown {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0) scale(1);
}

.dropdown-user-info {
  padding: 12px 20px;
  text-align: center;
}

.dropdown-user-info strong {
  display: block;
  color: white;
  font-size: 14px;
  margin-bottom: 4px;
}

.dropdown-user-info small {
  display: block;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.dropdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
  margin: 6px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s ease;
}

.dropdown-item:hover {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.2), transparent);
  color: #fff;
  padding-left: 28px;
}

.dropdown-item.logout:hover {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.2), transparent);
  color: #f87171;
}

/* ─── MOBILE MENU ────────────────────────────────── */
.mobile-menu-toggle {
  display: none;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  z-index: 101;
}

.mobile-menu-toggle span {
  width: 22px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.mobile-menu-toggle span.active:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.mobile-menu-toggle span.active:nth-child(2) { opacity: 0; }
.mobile-menu-toggle span.active:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.mobile-nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav {
  background: linear-gradient(135deg, rgba(30, 10, 60, 0.98), rgba(20, 20, 60, 0.98));
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 28px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 240px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  border-radius: 50px;
  transition: all 0.25s ease;
  background: rgba(139, 92, 246, 0.05);
}

.mobile-nav-link.active {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: #fff;
  box-shadow: 0 4px 15px rgba(100, 50, 200, 0.4);
}

.mobile-nav-enter-active,
.mobile-nav-leave-active { transition: opacity 0.3s ease; }
.mobile-nav-enter-from,
.mobile-nav-leave-to { opacity: 0; }

/* ─── HERO ───────────────────────────────────────── */
.hero {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  position: relative;
}

.hero-banner-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: brightness(0.65) saturate(1.2);
  animation: slowZoom 20s ease-in-out infinite;
  z-index: -2;
}

@keyframes slowZoom {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.hero-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 5, 30, 0.289) 0%, rgba(10, 10, 30, 0.4) 50%, rgba(5, 5, 20, 0.356) 100%);
  z-index: -1;
}

.hero-content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
}

.hero-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 120px 24px 60px;
}

.hero-tag {
  display: inline-block;
  background: rgba(139, 92, 246, 0.15);
  backdrop-filter: blur(10px);
  color: #ae73e5;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  padding: 8px 24px;
  border-radius: 50px;
  margin-bottom: 30px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  animation: fadeInUp 0.8s ease;
}

.hero h1 {
  font-size: clamp(48px, 10vw, 85px);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 24px;
  animation: fadeInUp 0.8s ease 0.1s both;
}

.gradient-text {
  background: linear-gradient(135deg, #9e9e9e, #8b5cf6, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-sub {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 auto 50px;
  max-width: 600px;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 50px;
  animation: fadeInUp 0.8s ease 0.3s both;
}

.stat strong {
  display: block;
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.stat span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hero-btns {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease 0.4s both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-scroll-indicator {
  position: absolute;
  bottom: 30px;
  right: 40px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.hero-scroll-indicator:hover { transform: translateY(-3px); }

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(139, 92, 246, 0.6);
  border-radius: 20px;
  position: relative;
}

.scroll-mouse::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 8px;
  background: #8b5cf6;
  border-radius: 2px;
  animation: scrollWheel 2s infinite;
}

.scroll-arrow {
  color: rgba(139, 92, 246, 0.6);
  font-size: 14px;
  animation: bounceArrow 2s infinite;
}

@keyframes scrollWheel {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  80% { opacity: 0; transform: translateX(-50%) translateY(12px); }
  100% { opacity: 0; transform: translateX(-50%) translateY(0); }
}

@keyframes bounceArrow {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(5px); opacity: 1; }
}

/* ─── BUTTONS ────────────────────────────────────── */
.btn-primary {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: #fff;
  border: none;
  padding: 14px 36px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(100, 50, 200, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(100, 50, 200, 0.5);
}

.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary.small { padding: 10px 24px; font-size: 14px; }

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(139, 92, 246, 0.5);
  padding: 14px 36px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  transform: translateY(-2px);
}

.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 99;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(100, 50, 200, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.scroll-top-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(100, 50, 200, 0.5);
  animation: none;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
}

/* ─── SEARCH BAR ─────────────────────────────────── */
.search-bar {
  position: sticky;
  top: 70px;
  z-index: 90;
  padding: 16px 24px;
  background: rgba(15, 10, 40, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.search-inner {
  max-width: 800px;
  margin: 0 auto;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 50px;
  padding: 0 20px;
  margin-bottom: 14px;
  transition: all 0.3s ease;
}

.search-row:focus-within {
  border-color: #8b5cf6;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
}

.search-row input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-size: 15px;
  padding: 14px 0;
}

.search-row input::placeholder { color: rgba(255, 255, 255, 0.4); }

.clear-btn {
  background: rgba(139, 92, 246, 0.2);
  border: none;
  color: #fff;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.clear-btn:hover { background: rgba(139, 92, 246, 0.4); }

.chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.chip {
  padding: 8px 20px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 30px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chip:hover {
  background: rgba(139, 92, 246, 0.2);
  color: #fff;
  transform: translateY(-2px);
}

.chip.active {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: #fff;
  border-color: transparent;
}

/* ─── MAIN ───────────────────────────────────────── */
.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 24px 80px;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 28px;
}

/* ─── STATES ─────────────────────────────────────── */
.state-box {
  text-align: center;
  padding: 80px 24px;
  color: rgba(255, 255, 255, 0.7);
}

.state-icon { font-size: 64px; margin-bottom: 20px; }
.state-box h3 { font-size: 24px; color: #fff; margin-bottom: 12px; }
.state-box p { margin-bottom: 24px; }

/* ─── SPINNER ────────────────────────────────────── */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

.spinner.large {
  width: 45px;
  height: 45px;
  margin: 0 auto 20px;
  display: block;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ─── ERROR TOAST ────────────────────────────────── */
.error-toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  font-size: 14px;
}

.error-toast button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
}

/* ─── COMMUNITY ──────────────────────────────────── */
.community-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.community-header {
  text-align: center;
  margin-bottom: 50px;
}

.community-header h1 {
  font-size: 42px;
  background: linear-gradient(135deg, #a855f7, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 15px;
}

.community-header p { color: rgba(255, 255, 255, 0.7); font-size: 18px; }

.community-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.community-card {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;
  text-align: center;
}

.community-card:hover {
  transform: translateY(-8px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.2);
}

.card-icon { font-size: 64px; margin-bottom: 20px; }
.community-card h2 { font-size: 28px; margin-bottom: 15px; color: white; }
.community-card p { color: rgba(255, 255, 255, 0.7); line-height: 1.6; margin-bottom: 20px; }

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 25px;
}

.card-features span {
  background: rgba(139, 92, 246, 0.15);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.join-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 40px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.telegram-btn { background: #0088cc; color: white; }
.telegram-btn:hover { background: #00a2e8; transform: scale(1.05); }
.discord-btn { background: #5865f2; color: white; }
.discord-btn:hover { background: #4752c4; transform: scale(1.05); }
.member-count { font-size: 13px; color: rgba(139, 92, 246, 0.8) !important; }

.guidelines-section { margin-bottom: 60px; }
.guidelines-section h2 { text-align: center; font-size: 32px; margin-bottom: 30px; color: #a855f7; }

.guidelines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.guideline {
  background: rgba(139, 92, 246, 0.05);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
}

.guideline:hover { background: rgba(139, 92, 246, 0.1); transform: translateY(-3px); }
.guideline-icon { font-size: 40px; display: block; margin-bottom: 15px; }
.guideline h3 { font-size: 18px; margin-bottom: 10px; color: white; }
.guideline p { font-size: 14px; color: rgba(255, 255, 255, 0.6); }

/* ─── CINEMA ─────────────────────────────────────── */
.cinema-section {
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeInUp 0.5s ease;
}

/* ─── PAGINATION ─────────────────────────────────── */
.pagination-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  position: relative;
}

.pagination-wrapper::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, #8b5cf6, transparent);
  border-radius: 2px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 40px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.pagination-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.pagination-pages {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.page-number {
  min-width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.06);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.page-number:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: #8b5cf6;
  transform: translateY(-2px);
}

.page-number.active {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
  transform: scale(1.05);
}

.page-number.active::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  z-index: -1;
  opacity: 0.5;
  filter: blur(6px);
  animation: glowPulse 2s ease infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.page-ellipsis {
  min-width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  letter-spacing: 2px;
}

.pagination-info {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(139, 92, 246, 0.05);
  padding: 6px 16px;
  border-radius: 40px;
}

.separator { color: rgba(139, 92, 246, 0.4); font-size: 12px; }

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.per-page-selector label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.per-page-selector select {
  padding: 8px 32px 8px 14px;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 40px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.per-page-selector select:hover { background-color: rgba(139, 92, 246, 0.15); border-color: #8b5cf6; }
.per-page-selector select option { background: #1a0a3a; color: white; }

/* ─── FOOTER ─────────────────────────────────────── */
.footer {
  background: linear-gradient(135deg, rgba(10, 5, 30, 0.98), rgba(5, 5, 20, 0.98));
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  padding: 60px 24px 30px;
  margin-top: 40px;
}

.footer-inner {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 2fr;
  gap: 60px;
  padding-bottom: 50px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.15);
}

.footer-brand { max-width: 350px; }

.footer-logo {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-logo .logo-icon { font-size: 32px; }

.footer-logo span:last-child {
  background: linear-gradient(135deg, #a855f7, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.footer-brand p { font-size: 14px; color: rgba(255, 255, 255, 0.6); line-height: 1.6; margin-bottom: 20px; }

.footer-social { display: flex; gap: 12px; }

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.social-link:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
  transform: translateY(-3px);
  color: #8b5cf6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.link-col h4 {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #a855f7;
  margin-bottom: 20px;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
}

.link-col h4::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6);
  border-radius: 2px;
}

.link-col ul { list-style: none; padding: 0; margin: 0; }
.link-col li { margin-bottom: 12px; }

.link-col a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.link-col a:hover { color: #8b5cf6; transform: translateX(5px); }

.footer-bottom {
  max-width: 1300px;
  margin: 0 auto;
  padding-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-copyright p { font-size: 13px; color: rgba(255, 255, 255, 0.4); margin: 0; }
.made-with { margin-top: 5px; font-size: 12px; }

.heart {
  color: #ef4444;
  display: inline-block;
  animation: heartbeat 1.5s ease infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.footer-badges { display: flex; gap: 15px; flex-wrap: wrap; }

.badge {
  font-size: 11px;
  padding: 5px 12px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 30px;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.badge:hover { background: rgba(139, 92, 246, 0.2); border-color: #8b5cf6; transform: translateY(-2px); }

/* ─── RESPONSIVE ─────────────────────────────────── */
@media (max-width: 1024px) {
  .nav-link { padding: 8px 20px; font-size: 13px; }

  .footer-inner { grid-template-columns: 1fr; gap: 40px; }
  .footer-brand { max-width: 100%; text-align: center; }
  .footer-social { justify-content: center; }
  .footer-links { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 860px) {
  .nav-link { padding: 8px 16px; font-size: 12px; }
}

@media (max-width: 768px) {
  .header-inner { grid-template-columns: auto 1fr; padding: 0 1.5rem; }
  .nav { display: none; }
  .mobile-menu-toggle { display: flex; }
  .header-actions { justify-self: end; }
  .logo-image { height: 44px; }

  .hero h1 { font-size: 42px; }
  .hero-stats { gap: 35px; }
  .stat strong { font-size: 32px; }
  .hero-btns { flex-direction: column; align-items: center; }
  .hero-scroll-indicator { right: 20px; bottom: 20px; }
  .scroll-mouse { width: 20px; height: 32px; }

  .footer { padding: 40px 20px 25px; }
  .footer-inner { gap: 30px; padding-bottom: 30px; }
  .footer-links { grid-template-columns: 1fr; gap: 25px; text-align: center; }
  .link-col h4::after { left: 50%; transform: translateX(-50%); }
  .footer-bottom { flex-direction: column; text-align: center; }
  .footer-badges { justify-content: center; }
  .footer-copyright { text-align: center; }

  .pagination-btn { padding: 8px 14px; font-size: 12px; }
  .pagination-btn .btn-text { display: none; }
  .pagination-btn.prev, .pagination-btn.next { padding: 10px; border-radius: 50%; }
  .page-number { min-width: 38px; height: 38px; font-size: 13px; border-radius: 12px; }
  .per-page-selector { justify-content: center; }

  .community-header h1 { font-size: 32px; }
  .guidelines-grid { grid-template-columns: 1fr; }
  .scroll-top-btn { width: 40px; height: 40px; font-size: 20px; bottom: 20px; right: 20px; }
}

@media (max-width: 480px) {
  .header-actions .icon-btn:first-child { display: none; }
  .header-inner { padding: 0 1rem; }
  .hero h1 { font-size: 32px; }
  .hero-stats { gap: 25px; }
  .stat strong { font-size: 24px; }
  .hero-tag { font-size: 10px; letter-spacing: 2px; }
  .footer-links { grid-template-columns: 1fr; }
  .community-grid { grid-template-columns: 1fr; }
  .pagination-pages { gap: 6px; }
  .page-number { min-width: 34px; height: 34px; font-size: 12px; border-radius: 10px; }
  .page-ellipsis { min-width: 34px; height: 34px; }
}
.articles-section {
  max-width: 1400px;
  margin: 40px auto 0;
  padding: 0 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.view-all {
  color: #8b5cf6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.view-all:hover {
  color: #a78bfa;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.article-card {
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
}

.article-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-category {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.article-content {
  padding: 16px;
}

.article-content h3 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.article-content p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.article-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: rgba(139, 92, 246, 0.7);
}

.loading {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 40px;
}

@media (max-width: 768px) {
  .articles-section {
    margin: 20px auto 0;
    padding: 0 16px;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header h2 {
    font-size: 20px;
  }
}.slideshow-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.slide.active {
  opacity: 1;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4));
}

.slide-prev,
.slide-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  padding: 16px 20px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
  transition: background 0.3s;
  z-index: 10;
}

.slide-prev:hover,
.slide-next:hover {
  background: rgba(139, 92, 246, 0.8);
}

.slide-prev {
  left: 20px;
}

.slide-next {
  right: 20px;
}

.slide-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  background: #8b5cf6;
  width: 30px;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .slide-prev, .slide-next { padding: 10px 14px; font-size: 14px; }
  .slide-prev { left: 10px; }
  .slide-next { right: 10px; }
}
</style>