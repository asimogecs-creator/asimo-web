// Dynamic Gallery Loader - Preserves all animations and spacing
class GalleryManager {
    constructor() {
        this.galleryData = null;
    }

    async loadGallery() {
        try {
            const response = await fetch('./data/gallery.json');
            this.galleryData = await response.json();
            return this.galleryData;
        } catch (error) {
            console.error('Error loading gallery:', error);
            return null;
        }
    }

    renderGallery(container) {
        if (!this.galleryData || !container) return;

        // Only show first 3 items for main page gallery
        const items = this.galleryData.gallery.slice(0, 3);
        
        container.innerHTML = '';

        items.forEach((item, index) => {
            const galleryItem = this.createGalleryItem(item, index);
            container.appendChild(galleryItem);
        });
    }

    createGalleryItem(item, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item glass-container';
        itemDiv.setAttribute('data-aos', 'fade-up');
        itemDiv.setAttribute('data-aos-delay', (index * 30).toString()); // Much faster delay - 30ms between cards

        // Always try to load the image first, with fallback handling
        if (item.image) {
            itemDiv.innerHTML = `
                <div class="gallery-image-container">
                    <img src="${item.image}" 
                         alt="${item.title}" 
                         loading="lazy"
                         onerror="this.parentElement.innerHTML='<div class=\\"gallery-placeholder\\"><i class=\\"fas fa-image\\"></i><span>${item.placeholder || item.title}</span></div>'">
                    <div class="gallery-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `;
        } else {
            itemDiv.innerHTML = `
                <div class="gallery-placeholder">
                    <i class="fas fa-image"></i>
                    <span>${item.placeholder || item.title}</span>
                </div>
            `;
        }

        return itemDiv;
    }

    // Method to validate if image exists
    async imageExists(imagePath) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;
        });
    }

    // Enhanced render method with image validation
    async renderGalleryWithValidation(container) {
        if (!this.galleryData || !container) return;

        // Only show first 3 items for main page gallery, unless it's the extended gallery page
        const isExtendedGallery = container.id === 'gallery-extended';
        const items = isExtendedGallery ? this.galleryData.gallery : this.galleryData.gallery.slice(0, 3);
        
        container.innerHTML = '';

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            // Check if image actually exists
            if (item.image) {
                const imageExists = await this.imageExists(item.image);
                if (!imageExists) {
                    console.warn(`Image not found: ${item.image}. Using placeholder for ${item.title}`);
                }
            }
            
            const galleryItem = this.createGalleryItem(item, i);
            container.appendChild(galleryItem);
        }
    }

    // Method to refresh gallery data and re-render
    async refreshGallery(container) {
        console.log('Refreshing gallery...');
        await this.loadGallery();
        await this.renderGalleryWithValidation(container);
        
        // Refresh AOS animations for new content
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        console.log('Gallery refreshed successfully!');
    }

    // Method to add new image to gallery dynamically
    async addImageToGallery(imageData, container) {
        if (!this.galleryData) {
            await this.loadGallery();
        }
        
        // Add new image to the data
        this.galleryData.gallery.push(imageData);
        
        // Re-render gallery
        await this.renderGalleryWithValidation(container);
        
        console.log(`Added new image: ${imageData.title}`);
    }
}

// Export for use in other files
window.GalleryManager = GalleryManager;
// Gallery Extended Loader for gallery.html
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.endsWith('gallery.html')) {
        const container = document.getElementById('gallery-extended');
        if (container) {
            const manager = new GalleryManager();
            await manager.loadGallery();
            // Render all images as cards without text
            container.innerHTML = '';
            manager.galleryData.gallery.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'gallery-card';
                card.setAttribute('data-aos', 'fade-up');
                card.setAttribute('data-aos-delay', (index * 20).toString()); // Very fast delay - 20ms between cards
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='assets/images/tech-event.jpg'">
                `;
                container.appendChild(card);
            });
            if (typeof AOS !== 'undefined') { AOS.refresh(); }
        }
    }
});
