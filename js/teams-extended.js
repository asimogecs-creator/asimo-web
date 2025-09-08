// Teams Extended Page Functionality
class TeamsExtended {
    constructor() {
        this.sections = ['batch-2023', 'batch-2022', 'batch-2021'];
        this.currentSection = 0;
        this.isScrolling = false;
        this.quotes = [];
        this.currentQuoteIndex = 0;
        this.quoteInterval = null;
        this.init();
    }

    init() {
        this.setupProgressBar();
        this.setupNavigation();
        this.setupScrollHandlers();
        this.loadTeamMembers();
        this.loadQuotes();
        this.checkURLHash();
    }

    // Setup scroll progress bar
    setupProgressBar() {
        const progressLight = document.querySelector('.progress-light');
        if (!progressLight) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / documentHeight) * 100;
            
            // Move the light along the progress bar
            progressLight.style.transform = `translateY(${scrollPercent * 3}px)`;
        });
    }

    // Setup batch navigation dots
    setupNavigation() {
        const navDots = document.querySelectorAll('.nav-dot');
        
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const batchId = dot.getAttribute('data-batch');
                this.scrollToBatch(batchId);
            });
        });

        // Update active dot on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavDot();
        });
    }

    // Setup scroll handlers
    setupScrollHandlers() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                this.updateActiveNavDot();
            }, 100);
        });
    }

    // Scroll to specific batch section
    scrollToBatch(batchYear) {
        const section = document.getElementById(`batch-${batchYear}`);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Update active navigation dot
    updateActiveNavDot() {
        const navDots = document.querySelectorAll('.nav-dot');
        const sections = document.querySelectorAll('.batch-section');
        
        let currentSectionIndex = 0;
        const scrollPosition = window.pageYOffset + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionIndex = index;
            }
        });
        
        navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSectionIndex);
        });
    }

    // Load team members data
    async loadTeamMembers() {
        try {
            const teamsManager = new TeamsManager();
            await teamsManager.loadTeams();
            
            if (teamsManager.teamsData) {
                this.renderBatchMembers('2023', teamsManager.teamsData);
                this.renderBatchMembers('2022', teamsManager.teamsData);
                this.renderBatchMembers('2021', teamsManager.teamsData);
            }
        } catch (error) {
            console.error('Error loading team members:', error);
            this.showErrorMessage();
        }
    }

    // Load quotes data
    async loadQuotes() {
        try {
            const response = await fetch('./data/members.json');
            const data = await response.json();
            
            if (data.teamMembers && data.teamMembers.quotes) {
                this.quotes = data.teamMembers.quotes;
                this.renderQuotes();
                this.setupQuoteNavigation();
                this.startAutoSlide();
            }
        } catch (error) {
            console.error('Error loading quotes:', error);
            this.showQuotesError();
        }
    }

    // Render quotes carousel
    renderQuotes() {
        const carousel = document.getElementById('quotes-carousel');
        const indicators = document.getElementById('quoteIndicators');
        
        if (!carousel || !indicators) return;

        // Clear loading content
        carousel.innerHTML = '';
        indicators.innerHTML = '';

        // Create quote cards
        this.quotes.forEach((quote, index) => {
            const quoteCard = this.createQuoteCard(quote, index);
            carousel.appendChild(quoteCard);

            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = `quote-indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('data-quote-index', index);
            indicators.appendChild(indicator);
        });

        // Show first quote
        if (this.quotes.length > 0) {
            this.showQuote(0);
        }
    }

    // Create individual quote card
    createQuoteCard(quote, index) {
        const card = document.createElement('div');
        card.className = `quote-card ${index === 0 ? 'active' : ''}`;
        card.setAttribute('data-quote-index', index);

        card.innerHTML = `
            <div class="quote-background" style="background-image: url('${quote.image}')"></div>
            <div class="quote-content">
                <i class="fas fa-quote-right quote-icon"></i>
                <p class="quote-text">${quote.text}</p>
                <p class="quote-author">${quote.author}</p>
            </div>
        `;

        return card;
    }

    // Setup quote navigation
    setupQuoteNavigation() {
        const prevBtn = document.getElementById('prevQuote');
        const nextBtn = document.getElementById('nextQuote');
        const indicators = document.querySelectorAll('.quote-indicator');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.stopAutoSlide();
                this.previousQuote();
                this.startAutoSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.stopAutoSlide();
                this.nextQuote();
                this.startAutoSlide();
            });
        }

        // Indicator click handlers
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.stopAutoSlide();
                this.showQuote(index);
                this.startAutoSlide();
            });
        });
    }

    // Show specific quote
    showQuote(index) {
        if (index < 0 || index >= this.quotes.length) return;

        // Hide all quotes
        const allQuotes = document.querySelectorAll('.quote-card');
        const allIndicators = document.querySelectorAll('.quote-indicator');

        allQuotes.forEach(quote => {
            quote.classList.remove('active');
        });

        allIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // Show selected quote
        const selectedQuote = document.querySelector(`[data-quote-index="${index}"]`);
        const selectedIndicator = document.querySelector(`.quote-indicator[data-quote-index="${index}"]`);

        if (selectedQuote) {
            selectedQuote.classList.add('active');
        }

        if (selectedIndicator) {
            selectedIndicator.classList.add('active');
        }

        this.currentQuoteIndex = index;
    }

    // Next quote
    nextQuote() {
        const nextIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
        this.showQuote(nextIndex);
    }

    // Previous quote
    previousQuote() {
        const prevIndex = this.currentQuoteIndex === 0 ? this.quotes.length - 1 : this.currentQuoteIndex - 1;
        this.showQuote(prevIndex);
    }

    // Start auto slide
    startAutoSlide() {
        this.stopAutoSlide(); // Clear any existing interval
        this.quoteInterval = setInterval(() => {
            this.nextQuote();
        }, 5000); // Change quote every 5 seconds
    }

    // Stop auto slide
    stopAutoSlide() {
        if (this.quoteInterval) {
            clearInterval(this.quoteInterval);
            this.quoteInterval = null;
        }
    }

    // Show quotes error
    showQuotesError() {
        const carousel = document.getElementById('quotes-carousel');
        if (carousel) {
            carousel.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading inspirational quotes. Please try again later.</p>
                </div>
            `;
        }
    }

    // Render members for a specific batch
    renderBatchMembers(batchYear, teamsData) {
        const container = document.getElementById(`members-${batchYear}`);
        if (!container) return;

        // Find batch data
        const batchData = teamsData.batches.find(batch => batch.year === batchYear);
        if (!batchData) {
            container.innerHTML = `
                <div class="no-members">
                    <i class="fas fa-users"></i>
                    <p>No members found for batch ${batchYear}</p>
                </div>
            `;
            return;
        }

        // Clear loading content
        container.innerHTML = '';

        // Render members
        batchData.members.forEach((member, index) => {
            const memberCard = this.createMemberCard(member, index);
            container.appendChild(memberCard);
        });

        // Refresh AOS animations with fast settings for teams
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 180,
                easing: 'ease-out-cubic',
                once: true,
                offset: 30,
                delay: 0
            });
            AOS.refresh();
        }
    }

    // Create individual member card
    createMemberCard(member, index) {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.setAttribute('data-aos', 'fade-up');
        // Ultra-fast loading: 20ms delay between cards for 0.18s total time
        card.setAttribute('data-aos-delay', (index * 20).toString());

        // Generate avatar (either image or initials)
        const avatarContent = member.photo 
            ? `<img src="${member.photo}" alt="${member.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">`
            : '';

        const initialsContent = `<span class="initials" ${member.photo ? 'style="display:none"' : ''}>${this.getInitials(member.name)}</span>`;

        card.innerHTML = `
            <div class="member-lens">
                <div class="member-lens-bg"></div>
                <div class="member-avatar">
                    ${avatarContent}
                    ${initialsContent}
                </div>
            </div>
            <div class="member-content">
                <h3 class="member-name">${member.name}</h3>
            </div>
        `;

        // Add 3D tilt effect
        this.add3DTiltEffect(card);

        return card;
    }

    // Get initials from name
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Generate social media links
    generateSocialLinks(social) {
        if (!social) return '';

        let links = '';
        
        if (social.linkedin) {
            links += `<a href="${social.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
        }
        if (social.github) {
            links += `<a href="${social.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>`;
        }
        if (social.instagram) {
            links += `<a href="${social.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>`;
        }
        if (social.twitter) {
            links += `<a href="${social.twitter}" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>`;
        }
        if (social.email) {
            links += `<a href="mailto:${social.email}" title="Email"><i class="fas fa-envelope"></i></a>`;
        }

        return links;
    }

    // Show social links modal/dropdown
    showSocialLinks(event, socialData) {
        event.preventDefault();
        event.stopPropagation();
        
        // Remove any existing modal
        const existingModal = document.querySelector('.social-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'social-modal';
        modal.innerHTML = `
            <div class="social-modal-content">
                <div class="social-modal-header">
                    <h4>Connect with me</h4>
                    <button class="close-modal" onclick="this.closest('.social-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="social-links-grid">
                    ${this.generateSocialLinksGrid(socialData)}
                </div>
            </div>
            <div class="social-modal-overlay" onclick="this.closest('.social-modal').remove()"></div>
        `;

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // Generate social links grid for modal
    generateSocialLinksGrid(social) {
        if (!social) return '<p>No social links available</p>';

        let links = '';
        
        if (social.linkedin) {
            links += `
                <a href="${social.linkedin}" target="_blank" class="social-link-item linkedin">
                    <i class="fab fa-linkedin"></i>
                    <span>LinkedIn</span>
                </a>`;
        }
        if (social.github) {
            links += `
                <a href="${social.github}" target="_blank" class="social-link-item github">
                    <i class="fab fa-github"></i>
                    <span>GitHub</span>
                </a>`;
        }
        if (social.instagram) {
            links += `
                <a href="${social.instagram}" target="_blank" class="social-link-item instagram">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram</span>
                </a>`;
        }
        if (social.twitter) {
            links += `
                <a href="${social.twitter}" target="_blank" class="social-link-item twitter">
                    <i class="fab fa-twitter"></i>
                    <span>Twitter</span>
                </a>`;
        }
        if (social.email) {
            links += `
                <a href="mailto:${social.email}" class="social-link-item email">
                    <i class="fas fa-envelope"></i>
                    <span>Email</span>
                </a>`;
        }

        return links || '<p>No social links available</p>';
    }

    // Show error message
    showErrorMessage() {
        const containers = ['members-2023', 'members-2022', 'members-2021'];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading team members. Please try again later.</p>
                    </div>
                `;
            }
        });
    }

    // Check URL hash for direct navigation
    checkURLHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash && hash.startsWith('batch-')) {
            const batchYear = hash.replace('batch-', '');
            setTimeout(() => {
                this.scrollToBatch(batchYear);
            }, 500);
        }
    }

    // Add 3D tilt effect to member cards
    add3DTiltEffect(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const x = (e.clientX - centerX) / (rect.width / 2);
            const y = (e.clientY - centerY) / (rect.height / 2);
            
            // Adjust the rotation strength
            const rotateX = y * -8; // Invert y for natural rotation
            const rotateY = x * 8;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        // Reset the card position when the mouse leaves
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on teams.html page
    if (window.location.pathname.endsWith('teams.html')) {
        new TeamsExtended();
    }
});

// Handle navigation from main page
window.addEventListener('load', () => {
    // Check if we came from main page with a specific batch
    const urlParams = new URLSearchParams(window.location.search);
    const batch = urlParams.get('batch');
    
    if (batch) {
        setTimeout(() => {
            const teamsExtended = new TeamsExtended();
            teamsExtended.scrollToBatch(batch);
        }, 1000);
    }
});

// Export for global access
window.TeamsExtended = TeamsExtended;
