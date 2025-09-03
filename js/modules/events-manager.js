// Dynamic Events Loader - Preserves all animations and spacing
class EventsManager {
    constructor() {
        this.eventsData = null;
        this.maxFeaturedEvents = 6; // Show 6 events on home page
    }

    async loadEvents() {
        try {
            const response = await fetch('./data/events.json');
            this.eventsData = await response.json();
            return this.eventsData;
        } catch (error) {
            console.error('Error loading events:', error);
            return null;
        }
    }

    renderFeaturedEvents(container) {
        if (!this.eventsData || !container) return;

        const featuredEvents = this.eventsData.events
            .filter(event => event.featured)
            .sort((a, b) => a.priority - b.priority)
            .slice(0, this.maxFeaturedEvents);

        // Preserve timeline-line and remove only event items and loading content
        const timelineLine = container.querySelector('.timeline-line');
        const loadingContent = container.querySelector('.content-loading');
        
        // Remove existing event items
        const existingEvents = container.querySelectorAll('.event-item');
        existingEvents.forEach(item => item.remove());
        
        // Remove loading content
        if (loadingContent) {
            loadingContent.remove();
        }

        featuredEvents.forEach((event, index) => {
            const eventCard = this.createEventCard(event, index);
            container.appendChild(eventCard);
        });
    }

    renderAllEvents(container) {
        if (!this.eventsData || !container) return;

        const allEvents = this.eventsData.events
            .sort((a, b) => a.priority - b.priority);

        // Preserve timeline-line if it exists and remove only event items
        const timelineLine = container.querySelector('.timeline-line');
        const existingEvents = container.querySelectorAll('.event-item');
        existingEvents.forEach(item => item.remove());

        allEvents.forEach((event, index) => {
            const eventCard = this.createEventCard(event, index);
            container.appendChild(eventCard);
        });
    }

    createEventCard(event, index) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';
        eventDiv.setAttribute('data-aos', 'fade-up');
        eventDiv.setAttribute('data-aos-delay', (index * 100).toString());

        eventDiv.innerHTML = `
            <div class="event-glass-card">
                <div class="event-icon ${event.id}-icon">
                    <i class="${event.icon}"></i>
                </div>
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                </div>
                <div class="tubelight-effect"></div>
            </div>
        `;

        return eventDiv;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                       'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: months[date.getMonth()]
        };
    }

}

// Export for use in other files
window.EventsManager = EventsManager;

// Extended Events Page Handler
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.endsWith('events.html')) {
        const container = document.getElementById('events-extended-grid');
        const filterTabs = document.querySelectorAll('.filter-tab');
        
        if (container) {
            const manager = new EventsManager();
            await manager.loadEvents();
            
            // Function to render events with filter
            const renderFilteredEvents = (filter = 'all') => {
                let filteredEvents = manager.eventsData.events;
                
                switch(filter) {
                    case 'upcoming':
                        filteredEvents = filteredEvents.filter(event => event.status === 'upcoming');
                        break;
                    case 'completed':
                        filteredEvents = filteredEvents.filter(event => event.status === 'completed');
                        break;
                    case 'featured':
                        filteredEvents = filteredEvents.filter(event => event.featured);
                        break;
                    case 'all':
                    default:
                        // Show all events
                        break;
                }
                
                // Clear container
                container.innerHTML = '';
                
                // Render filtered events
                filteredEvents.forEach((event, index) => {
                    const card = document.createElement('div');
                    card.className = 'event-card';
                    card.setAttribute('data-aos', 'fade-up');
                    card.setAttribute('data-aos-delay', (index * 100).toString());
                    
                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    card.innerHTML = `
                        <div class="event-status-corner ${event.status}">${event.status}</div>
                        <div class="event-icon">
                            <i class="${event.icon}"></i>
                        </div>
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-description">${event.description}</p>
                        <div class="event-meta">
                            <div class="event-date">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${formattedDate}</span>
                            </div>
                        </div>
                    `;
                    
                    container.appendChild(card);
                });
                
                // Refresh AOS animations
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            };
            
            // Initial render
            renderFilteredEvents('all');
            
            // Add filter functionality
            filterTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    filterTabs.forEach(t => t.classList.remove('active'));
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    // Render filtered events
                    renderFilteredEvents(tab.dataset.filter);
                });
            });
        }
    }
});
