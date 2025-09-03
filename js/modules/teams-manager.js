// Dynamic Teams & Quotes Loader - Preserves all animations and spacing
class TeamsManager {
    constructor() {
        this.teamsData = null;
    }

    async loadTeams() {
        try {
            const response = await fetch('./data/members.json');
            const data = await response.json();
            this.teamsData = data.teamMembers;
            return this.teamsData;
        } catch (error) {
            console.error('Error loading teams:', error);
            return null;
        }
    }

    renderBatches(container) {
        if (!this.teamsData || !container) return;

        const batches = this.teamsData.batches;
        
        container.innerHTML = '';

        batches.forEach((batch, index) => {
            const batchCard = this.createBatchCard(batch, index);
            container.appendChild(batchCard);
        });
    }

    createBatchCard(batch, index) {
        const batchDiv = document.createElement('div');
        batchDiv.className = 'batch-card glass-container';
        batchDiv.setAttribute('data-aos', 'fade-up');
        batchDiv.setAttribute('data-aos-delay', (index * 100).toString());
        batchDiv.setAttribute('data-batch', batch.year);

        batchDiv.innerHTML = `
            <div class="batch-icon">
                <i class="${batch.icon}"></i>
            </div>
            <h3>${batch.name}</h3>
            <button class="batch-btn" onclick="window.location.href='teams.html?batch=${batch.year}#batch-${batch.year}'">View Team</button>
        `;

        return batchDiv;
    }

    renderQuotes(container) {
        if (!this.teamsData || !container) return;

        const quotes = this.teamsData.quotes;
        
        // Recreate the full quotes carousel structure
        const parentContainer = container.closest('.quotes-carousel');
        if (parentContainer) {
            parentContainer.innerHTML = `
                <div class="carousel-header">
                    <h3>Inspiring Quotes from seniors</h3>
                    <div class="carousel-controls">
                        <button class="carousel-btn prev-btn" onclick="changeQuote(-1)">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="carousel-btn next-btn" onclick="changeQuote(1)">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="quotes-stack">
                    ${quotes.map((quote, index) => `
                        <div class="quote-card ${index === 0 ? 'active' : ''}" data-quote="${index}">
                            <div class="quote-content">
                                <i class="fas fa-quote-left quote-icon"></i>
                                <p>"${quote.text}"</p>
                                <span class="quote-author">- ${quote.author}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            // Fallback if container structure is different
            container.innerHTML = '';
            quotes.forEach((quote, index) => {
                const quoteCard = this.createQuoteCard(quote, index);
                container.appendChild(quoteCard);
            });
        }
    }

    createQuoteCard(quote, index) {
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'quote-card';
        quoteDiv.setAttribute('data-quote', index.toString());
        
        if (index === 0) {
            quoteDiv.classList.add('active');
        }

        quoteDiv.innerHTML = `
            <div class="quote-content">
                <i class="fas fa-quote-left quote-icon"></i>
                <p>"${quote.text}"</p>
                <span class="quote-author">- ${quote.author}</span>
            </div>
        `;

        return quoteDiv;
    }
}

// Export for use in other files
window.TeamsManager = TeamsManager;
