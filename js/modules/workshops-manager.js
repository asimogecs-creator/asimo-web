// Dynamic Workshops Loader - Preserves all animations and spacing
class WorkshopsManager {
    constructor() {
        this.workshopsData = null;
    }

    async loadWorkshops() {
        try {
            const response = await fetch('./data/workshops.json');
            this.workshopsData = await response.json();
            return this.workshopsData;
        } catch (error) {
            console.error('Error loading workshops:', error);
            return null;
        }
    }

    renderWorkshops(container) {
        if (!this.workshopsData || !container) return;

        const workshops = this.workshopsData.workshops.filter(w => w.featured);
        
        container.innerHTML = '';

        workshops.forEach((workshop, index) => {
            const workshopCard = this.createWorkshopCard(workshop, index);
            container.appendChild(workshopCard);
        });
    }

    createWorkshopCard(workshop, index) {
        const workshopDiv = document.createElement('div');
        workshopDiv.className = 'workshop-card glass-container';
        workshopDiv.setAttribute('data-aos', 'zoom-in');
        workshopDiv.setAttribute('data-aos-delay', (index * 1).toString());

        workshopDiv.innerHTML = `
            <div class="workshop-icon">
                <i class="${workshop.icon}"></i>
            </div>
            <h3>${workshop.title}</h3>
            <p>${workshop.description}</p>
            <button class="workshop-btn" onclick="openWorkshopModal('${workshop.id}')">Learn More</button>
        `;

        return workshopDiv;
    }

    getWorkshopById(id) {
        if (!this.workshopsData) return null;
        return this.workshopsData.workshops.find(workshop => workshop.id === id);
    }
}

// Global functions for modal control
function openWorkshopModal(workshopId) {
    const workshopsManager = window.workshopsManagerInstance;
    if (!workshopsManager) return;

    const workshop = workshopsManager.getWorkshopById(workshopId);
    if (!workshop) return;

    // Update modal content
    document.getElementById('workshopModalTitle').textContent = workshop.title;
    document.getElementById('workshopModalIcon').className = workshop.icon;
    document.getElementById('workshopModalDescription').textContent = workshop.description;

    // Show modal
    const modal = document.getElementById('workshopModal');
    modal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeWorkshopModal() {
    const modal = document.getElementById('workshopModal');
    modal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Close modal when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('workshopModal');
    const overlay = modal?.querySelector('.workshop-modal-overlay');
    
    if (overlay) {
        overlay.addEventListener('click', closeWorkshopModal);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeWorkshopModal();
        }
    });
});

// Export for use in other files
window.WorkshopsManager = WorkshopsManager;
