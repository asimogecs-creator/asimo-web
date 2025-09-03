// Featured Banners Manager
class FeaturedManager {
    constructor() {
        this.banners = [];
        this.currentIndex = 0;
        this.isAutoScrolling = true;
        this.autoScrollInterval = null;
        this.autoScrollDelay = 3000; // 3 seconds per banner
        this.userInteractionTimeout = null;
        this.pauseDuration = 3000; // 3 seconds pause after user interaction
    }

    async init() {
        try {
            await this.loadBanners();
            this.renderBanners();
            this.initializeAutoScroll();
            this.addEventListeners();
        } catch (error) {
            console.error('Featured Manager Error:', error);
            this.showErrorState();
        }
    }

    async loadBanners() {
        try {
            const response = await fetch('./data/featured.json');
            if (!response.ok) throw new Error('Failed to load featured banners');
            
            const data = await response.json();
            this.banners = data.featuredBanners.sort((a, b) => a.order - b.order);
        } catch (error) {
            console.error('Error loading banners:', error);
            this.banners = this.getFallbackBanners();
        }
    }

    getFallbackBanners() {
        return [
            {
                id: 'fallback-1',
                title: 'Welcome to ASIMO Tech Club',
                subtitle: 'Innovation • Technology • Excellence',
                description: 'Discover amazing opportunities in technology and innovation.',
                image: 'https://via.placeholder.com/800x400/667eea/ffffff?text=Tech+Innovation',
                isPlaceholder: true,
                buttonText: 'Explore',
                buttonLink: '#about',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }
        ];
    }

    renderBanners() {
        const container = document.getElementById('featured-banners-container');
        const indicatorsContainer = document.getElementById('banner-indicators');
        if (!container) return;

        container.innerHTML = '';
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
        }

        // For infinite scrolling, we need to clone first and last banners
        const bannersToRender = this.prepareBannersForInfiniteScroll();

        bannersToRender.forEach((banner, index) => {
            const bannerElement = this.createBannerElement(banner, index);
            container.appendChild(bannerElement);
        });

        // Create indicators (only for original banners, not clones)
        if (indicatorsContainer) {
            this.banners.forEach((banner, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'banner-indicator';
                indicator.setAttribute('data-index', index);
                indicatorsContainer.appendChild(indicator);
            });
        }

        // Set initial position (offset by 1 to account for cloned banner at start)
        this.currentIndex = 0;
        // Force immediate position without transition
        setTimeout(() => {
            this.updateActiveBanner(0, false);
        }, 50);
    }

    prepareBannersForInfiniteScroll() {
        if (this.banners.length <= 1) return this.banners;

        // Clone last banner at the beginning and first banner at the end
        const lastBanner = { ...this.banners[this.banners.length - 1], isClone: true };
        const firstBanner = { ...this.banners[0], isClone: true };

        return [lastBanner, ...this.banners, firstBanner];
    }

    createBannerElement(banner, index) {
        const bannerDiv = document.createElement('div');
        bannerDiv.className = 'featured-banner';
        bannerDiv.setAttribute('data-index', index);
        bannerDiv.setAttribute('data-aos', 'fade-up');
        bannerDiv.setAttribute('data-aos-delay', '100');

        const imageUrl = banner.isPlaceholder 
            ? `https://via.placeholder.com/800x400/${this.getPlaceholderColor(index)}/ffffff?text=${encodeURIComponent(banner.title)}`
            : banner.image;

        bannerDiv.innerHTML = `
            <div class="banner-background" style="background: ${banner.gradient}, url('${imageUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
            <div class="banner-overlay"></div>
            <div class="banner-content">
                <div class="banner-text">
                    <h3 class="banner-title">${banner.title}</h3>
                    <h4 class="banner-subtitle">${banner.subtitle}</h4>
                    <p class="banner-description">${banner.description}</p>
                    <a href="${banner.buttonLink}" class="banner-btn">
                        <span>${banner.buttonText}</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
            <div class="banner-tubelight-effect"></div>
        `;

        return bannerDiv;
    }

    getPlaceholderColor(index) {
        const colors = ['667eea', 'f093fb', '4facfe', 'a8edea', 'ffecd2'];
        return colors[index % colors.length];
    }

    initializeAutoScroll() {
        if (this.banners.length <= 1) return;

        this.autoScrollInterval = setInterval(() => {
            if (this.isAutoScrolling) {
                this.nextBanner();
            }
        }, this.autoScrollDelay);
    }

    nextBanner() {
        this.currentIndex++;
        this.updateActiveBanner(this.currentIndex, true);
        
        // Handle infinite scroll transition
        if (this.currentIndex >= this.banners.length) {
            setTimeout(() => {
                this.currentIndex = 0;
                this.updateActiveBanner(0, false);
            }, 600); // Wait for transition to complete
        }
    }

    prevBanner() {
        this.currentIndex--;
        this.updateActiveBanner(this.currentIndex, true);
        
        // Handle infinite scroll transition
        if (this.currentIndex < 0) {
            setTimeout(() => {
                this.currentIndex = this.banners.length - 1;
                this.updateActiveBanner(this.currentIndex, false);
            }, 600); // Wait for transition to complete
        }
    }

    goToBanner(index) {
        this.currentIndex = index;
        this.updateActiveBanner(index, true);
    }

    updateActiveBanner(index, withTransition = true) {
        const container = document.getElementById('featured-banners-container');
        if (!container) return;

        const indicators = document.querySelectorAll('.banner-indicator');

        // Update indicators (only for original banners)
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === (index < 0 ? this.banners.length - 1 : index % this.banners.length));
        });

        // Calculate position for infinite scroll
        let translateX;
        if (this.banners.length <= 1) {
            translateX = 0;
        } else {
            // Offset by 1 to account for cloned banner at start
            translateX = -(index + 1) * 100;
        }

        // Apply transition
        if (withTransition) {
            container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            container.style.transition = 'none';
        }

        container.style.transform = `translateX(${translateX}%)`;
    }

    pauseAutoScroll() {
        this.isAutoScrolling = false;
        
        // Clear existing timeout
        if (this.userInteractionTimeout) {
            clearTimeout(this.userInteractionTimeout);
        }
        
        // Resume auto-scroll after pause duration
        this.userInteractionTimeout = setTimeout(() => {
            this.isAutoScrolling = true;
        }, this.pauseDuration);
    }

    addEventListeners() {
        // Pause auto-scroll on hover
        const featuredSection = document.querySelector('.featured-section');
        if (featuredSection) {
            featuredSection.addEventListener('mouseenter', () => {
                this.pauseAutoScroll();
            });

            featuredSection.addEventListener('mouseleave', () => {
                // Don't immediately resume, let the pause duration handle it
            });
        }

        // Navigation buttons
        const prevBtn = document.querySelector('.banner-nav-prev');
        const nextBtn = document.querySelector('.banner-nav-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.pauseAutoScroll();
                this.prevBanner();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.pauseAutoScroll();
                this.nextBanner();
            });
        }

        // Indicator clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('banner-indicator')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.pauseAutoScroll();
                this.goToBanner(index);
            }
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;

        if (featuredSection) {
            featuredSection.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                this.pauseAutoScroll();
            });

            featuredSection.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;
                
                if (Math.abs(diffX) > 50) { // Minimum swipe distance
                    if (diffX > 0) {
                        this.nextBanner(); // Swipe left - next banner
                    } else {
                        this.prevBanner(); // Swipe right - previous banner
                    }
                }
            });
        }
    }

    showErrorState() {
        const container = document.getElementById('featured-banners-container');
        if (container) {
            container.innerHTML = `
                <div class="featured-banner active">
                    <div class="banner-content">
                        <div class="banner-text">
                            <h3 class="banner-title">Featured Content Loading...</h3>
                            <p class="banner-description">Please check back soon for exciting updates!</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    destroy() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }
        if (this.userInteractionTimeout) {
            clearTimeout(this.userInteractionTimeout);
        }
    }
}

// Initialize when DOM is loaded
if (typeof window !== 'undefined') {
    window.FeaturedManager = FeaturedManager;
}
