// New Simple Featured Manager
class NewFeaturedManager {
    constructor() {
        this.currentSlide = 0;
        this.banners = [];
        this.autoSlideInterval = null;
    }

    async init() {
        try {
            await this.loadBanners();
            this.renderBanners();
            this.setupAutoSlide();
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
            console.log('Loaded banners:', this.banners);
        } catch (error) {
            console.error('Error loading banners:', error);
            this.banners = [];
        }
    }

    renderBanners() {
        const container = document.getElementById('featured-banners-container');
        if (!container || this.banners.length === 0) {
            this.showErrorState();
            return;
        }

        // Clear existing content
        container.innerHTML = '';
        
        // Create banner elements
        this.banners.forEach((banner, index) => {
            const bannerElement = this.createBannerCard(banner, index);
            container.appendChild(bannerElement);
        });

        // Create navigation dots
        this.createNavigationDots();
        
        // Show first banner
        this.showSlide(0);
        
        console.log('Banners rendered successfully');
    }

    createBannerCard(banner, index) {
        const card = document.createElement('div');
        card.className = `featured-card ${index === 0 ? 'active' : ''}`;
        card.setAttribute('data-index', index);
        
        card.innerHTML = `
            <div class="card-image" style="background-image: url('${banner.image}');">
                <div class="card-gradient" style="background: ${banner.gradient}"></div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${banner.title}</h3>
                <h4 class="card-subtitle">${banner.subtitle}</h4>
                <p class="card-description">${banner.description}</p>
                <a href="${banner.buttonLink}" class="card-button">
                    ${banner.buttonText}
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        return card;
    }

    createNavigationDots() {
        let navContainer = document.querySelector('.banner-navigation');
        if (!navContainer) {
            // Create navigation container if it doesn't exist
            navContainer = document.createElement('div');
            navContainer.className = 'banner-navigation';
            document.querySelector('.featured-banners-wrapper').appendChild(navContainer);
        }

        navContainer.innerHTML = `
            <button class="nav-btn prev-btn" onclick="window.newFeaturedManager.prevSlide()">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="nav-dots">
                ${this.banners.map((_, index) => 
                    `<button class="nav-dot ${index === 0 ? 'active' : ''}" 
                             onclick="window.newFeaturedManager.goToSlide(${index})"></button>`
                ).join('')}
            </div>
            <button class="nav-btn next-btn" onclick="window.newFeaturedManager.nextSlide()">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    showSlide(index) {
        const cards = document.querySelectorAll('.featured-card');
        const dots = document.querySelectorAll('.nav-dot');
        
        // Hide all cards
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
        
        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.banners.length;
        this.showSlide(nextIndex);
        this.resetAutoSlide();
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.banners.length) % this.banners.length;
        this.showSlide(prevIndex);
        this.resetAutoSlide();
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoSlide();
    }

    setupAutoSlide() {
        if (this.banners.length <= 1) return;
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 5 seconds
    }

    resetAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.setupAutoSlide();
        }
    }

    showErrorState() {
        const container = document.getElementById('featured-banners-container');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <h3>Featured Content</h3>
                    <p>Content is being loaded...</p>
                </div>
            `;
        }
    }

    destroy() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }
}

// Create global instance
window.newFeaturedManager = new NewFeaturedManager();

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.newFeaturedManager.init();
    });
} else {
    window.newFeaturedManager.init();
}
