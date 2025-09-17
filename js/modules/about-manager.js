/**
 * About Section Content Manager
 * Loads and manages about section content from JSON data
 */

class AboutManager {
    constructor() {
        this.aboutData = null;
        this.isLoaded = false;
    }

    /**
     * Initialize the about manager
     */
    async init() {
        try {
            await this.loadAboutData();
            this.renderAboutContent();
            this.isLoaded = true;
            console.log('About section loaded successfully');
        } catch (error) {
            console.error('Error initializing about manager:', error);
            this.showErrorState();
        }
    }

    /**
     * Load about data from JSON file
     */
    async loadAboutData() {
        try {
            const response = await fetch('data/about.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.aboutData = await response.json();
        } catch (error) {
            console.error('Error loading about data:', error);
            throw error;
        }
    }

    /**
     * Render about content to the page
     */
    renderAboutContent() {
        if (!this.aboutData) {
            console.error('No about data available');
            return;
        }

        try {
            // Update title
            const titleElement = document.getElementById('about-title');
            if (titleElement) {
                titleElement.textContent = this.aboutData.sectionTitle;
            }

            // Update subtitle
            const subtitleElement = document.getElementById('about-subtitle');
            if (subtitleElement) {
                subtitleElement.textContent = this.aboutData.sectionSubtitle;
            }

            // Update description paragraphs
            const descriptionContainer = document.getElementById('about-description');
            if (descriptionContainer && this.aboutData.description) {
                descriptionContainer.innerHTML = `
                    <p>${this.aboutData.description.paragraph1}</p>
                    <p>${this.aboutData.description.paragraph2}</p>
                    <p>${this.aboutData.description.paragraph3}</p>
                `;
            }

            // Update highlights
            const highlightsContainer = document.getElementById('about-highlights');
            if (highlightsContainer && this.aboutData.highlights) {
                highlightsContainer.innerHTML = this.aboutData.highlights.map(highlight => `
                    <div class="highlight-item">
                        <i class="${highlight.icon}"></i>
                        <span>${highlight.text}</span>
                    </div>
                `).join('');
            }

            // Update image
            if (this.aboutData.image) {
                const imageElement = document.getElementById('about-image');
                if (imageElement) {
                    imageElement.src = this.aboutData.image.src;
                    imageElement.alt = this.aboutData.image.alt;
                }

                const overlayTitleElement = document.getElementById('about-overlay-title');
                if (overlayTitleElement) {
                    overlayTitleElement.textContent = this.aboutData.image.overlayTitle;
                }

                const overlayDescElement = document.getElementById('about-overlay-description');
                if (overlayDescElement) {
                    overlayDescElement.textContent = this.aboutData.image.overlayDescription;
                }
            }

        } catch (error) {
            console.error('Error rendering about content:', error);
            this.showErrorState();
        }
    }

    /**
     * Show error state when content fails to load
     */
    showErrorState() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const titleElement = aboutSection.querySelector('#about-title');
            if (titleElement) {
                titleElement.textContent = 'About ASIMO Technical Club';
            }
            
            const descriptionContainer = aboutSection.querySelector('#about-description');
            if (descriptionContainer) {
                descriptionContainer.innerHTML = `
                    <p>
                        <strong>ASIMO Technical Club</strong> is the flagship technical organization at 
                        <strong>Government Engineering College Samastipur (GEC Samastipur)</strong>. 
                        We foster technological advancement and engineering innovation.
                    </p>
                `;
            }
        }
    }

    /**
     * Update about data dynamically
     * @param {Object} newData - New about data
     */
    updateAboutData(newData) {
        if (!newData) {
            console.error('No data provided for update');
            return;
        }

        this.aboutData = { ...this.aboutData, ...newData };
        this.renderAboutContent();
        console.log('About section updated successfully');
    }

    /**
     * Get current about data
     * @returns {Object} Current about data
     */
    getAboutData() {
        return this.aboutData;
    }

    /**
     * Check if about manager is loaded
     * @returns {boolean} Loading status
     */
    isContentLoaded() {
        return this.isLoaded;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutManager;
}

// Global instance for direct use
window.AboutManager = AboutManager;