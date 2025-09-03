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
        workshopDiv.setAttribute('data-aos-delay', (index * 100).toString());

        workshopDiv.innerHTML = `
            <div class="workshop-icon">
                <i class="${workshop.icon}"></i>
            </div>
            <h3>${workshop.title}</h3>
            <p>${workshop.description}</p>
            <button class="workshop-btn">Learn More</button>
        `;

        return workshopDiv;
    }
}

// Export for use in other files
window.WorkshopsManager = WorkshopsManager;
