// Dynamic Content Loader - Main orchestrator
class ContentManager {
    constructor() {
        this.eventsManager = new EventsManager();
        this.workshopsManager = new WorkshopsManager();
        this.teamsManager = new TeamsManager();
        this.galleryManager = new GalleryManager();
        this.featuredManager = new FeaturedManager();
        // Use new featured manager if available
        if (typeof window.newFeaturedManager !== 'undefined') {
            this.newFeaturedManager = window.newFeaturedManager;
        }
        this.initialized = false;
        
        // Make workshops manager globally accessible for modal functions
        window.workshopsManagerInstance = this.workshopsManager;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Load all data
            const initPromises = [
                this.eventsManager.loadEvents(),
                this.workshopsManager.loadWorkshops(),
                this.teamsManager.loadTeams(),
                this.galleryManager.loadGallery()
            ];
            
            // Add featured manager initialization
            if (this.newFeaturedManager) {
                initPromises.push(this.newFeaturedManager.init());
            } else {
                initPromises.push(this.featuredManager.init());
            }
            
            await Promise.all(initPromises);

            // Render content based on page
            this.renderPageContent();
            
            // Reinitialize AOS for new content
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
                
                // Also reinitialize scroll effects
                if (typeof initScrollColorEffects === 'function') {
                    initScrollColorEffects();
                }
                if (typeof initSectionTubeLights === 'function') {
                    initSectionTubeLights();
                }
                
                // Initialize dynamic interactions (quotes, batch cards, etc.)
                if (typeof initializeDynamicInteractions === 'function') {
                    initializeDynamicInteractions();
                }
            }
            
            this.initialized = true;
            console.log('Dynamic content loaded successfully');
        } catch (error) {
            console.error('Error initializing content:', error);
            this.showError();
        }
    }

    renderPageContent() {
        // Check which page we're on
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (currentPage === 'index.html' || currentPage === '') {
            this.renderHomePage();
        } else if (currentPage === 'events.html') {
            this.renderEventsPage();
        }
    }

    renderHomePage() {
        // Render featured events (6 maximum)
        const eventsContainer = document.querySelector('.events-timeline');
        if (eventsContainer) {
            this.eventsManager.renderFeaturedEvents(eventsContainer);
        }

        // Render workshops
        const workshopsContainer = document.querySelector('.workshops-grid');
        if (workshopsContainer) {
            this.workshopsManager.renderWorkshops(workshopsContainer);
        }

        // Render team batches
        const batchesContainer = document.querySelector('.batch-grid');
        if (batchesContainer) {
            this.teamsManager.renderBatches(batchesContainer);
        }

        // Render quotes
        const quotesContainer = document.querySelector('.quotes-stack');
        if (quotesContainer) {
            this.teamsManager.renderQuotes(quotesContainer);
        }

        // Render gallery with validation
        const galleryContainer = document.querySelector('.gallery-grid');
        if (galleryContainer) {
            this.galleryManager.renderGalleryWithValidation(galleryContainer);
        }
    }

    renderEventsPage() {
        // Render all events
        const eventsContainer = document.querySelector('.all-events-container');
        if (eventsContainer) {
            this.eventsManager.renderAllEvents(eventsContainer);
        }
    }

    // Utility methods for external use
    getEventsData() {
        return this.eventsManager.eventsData;
    }

    getWorkshopsData() {
        return this.workshopsManager.workshopsData;
    }

    getTeamsData() {
        return this.teamsManager.teamsData;
    }

    getGalleryData() {
        return this.galleryManager.galleryData;
    }

    showError() {
        // Show error in loading placeholders
        const loadingElements = document.querySelectorAll('.content-loading');
        loadingElements.forEach(element => {
            element.innerHTML = `
                <div class="content-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading content. Please refresh the page.</p>
                </div>
            `;
        });
    }
}

// Global instance
window.contentManager = new ContentManager();

// Note: Initialization is handled by main.js to ensure proper timing with AOS
