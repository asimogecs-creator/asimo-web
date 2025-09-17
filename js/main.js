// Main JavaScript for GEC Tech Club Website - Advanced Version

// Theme Management
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (body.classList.contains('light-theme')) {
        // Switch to dark theme
        body.classList.remove('light-theme');
        themeIcon.className = 'fas fa-sun theme-toggle-icon';
        themeText.textContent = 'Light';
        localStorage.setItem('theme', 'dark');
    } else {
        // Switch to light theme
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-moon theme-toggle-icon';
        themeText.textContent = 'Dark';
        localStorage.setItem('theme', 'light');
    }
}

// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) themeIcon.className = 'fas fa-moon theme-toggle-icon';
        if (themeText) themeText.textContent = 'Dark';
    } else {
        document.body.classList.remove('light-theme');
        if (themeIcon) themeIcon.className = 'fas fa-sun theme-toggle-icon';
        if (themeText) themeText.textContent = 'Light';
    }
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Scroll to Timeline Function
function scrollToTimeline() {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
        eventsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme first
    initTheme();
    
    // Initialize AOS first
    AOS.init({
        duration: 1200,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 100
    });
    
    // Initialize advanced features
    initAdvancedNavigation();
    initNotificationSystem();
    // initAdvancedParticles(); // Disabled for clean background
    // initAdvancedAnimations(); // Disabled for static hero section
    initScrollColorEffects();
    initHeroTextScrollEffect();
    initSectionTubeLights();
    // initNeuralNetwork(); // Disabled for clean background
    
    // Initialize dynamic content system after AOS and other effects
    setTimeout(() => {
        if (typeof window.contentManager !== 'undefined' && window.contentManager) {
            window.contentManager.init().then(() => {
                // Initialize notification system
                if (typeof window.notificationManager !== 'undefined') {
                    window.notificationManager.loadNotifications().then(() => {
                        // Check for new notifications and show red dot if needed
                        if (window.notificationManager.hasNewNotifications()) {
                            window.showNewNotification();
                        }
                    });
                }
                
                // Initialize about section manager
                if (typeof window.AboutManager !== 'undefined') {
                    const aboutManager = new window.AboutManager();
                    aboutManager.init().catch(error => {
                        console.error('Failed to load about section:', error);
                    });
                }
                
                // Refresh AOS after dynamic content is loaded
                setTimeout(() => {
                    AOS.refresh();
                    console.log('🎨 All animations and effects reinitialized');
                }, 300);
            }).catch((error) => {
                console.error('Dynamic content initialization failed:', error);
            });
        }
    }, 200);
});

// Advanced Navigation System
function initAdvancedNavigation() {
    // Mobile Navigation Elements
    const hamburger = document.getElementById('mobile-hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Desktop Navigation Elements
    const desktopNavLinks = document.querySelectorAll('.nav-menu-desktop .nav-link');
    
    // Mobile hamburger menu toggle
    if (hamburger && mobileNav && mobileOverlay) {
        hamburger.addEventListener('click', function() {
            const isActive = hamburger.classList.contains('active');
            
            if (isActive) {
                // Close menu
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                // Open menu
                hamburger.classList.add('active');
                mobileNav.classList.add('active');
                mobileOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Active section highlighting for both desktop and mobile
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];
    
    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Smooth scrolling for all navigation links
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            
            // Check if it's a cross-page link (contains index.html or notifications.html)
            if (targetHref.includes('index.html') || targetHref.includes('notifications.html')) {
                // Allow normal navigation for cross-page links
                return;
            }
            
            // Handle same-page navigation with smooth scrolling
            e.preventDefault();
            const targetId = targetHref;
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Notification System
function initNotificationSystem() {
    // Get notification buttons and badges
    const desktopNotificationBtn = document.getElementById('desktop-notification-btn');
    const mobileNotificationBtn = document.getElementById('mobile-notification-btn');
    const desktopBadge = document.getElementById('desktop-notification-badge');
    const mobileBadge = document.getElementById('mobile-notification-badge');
    
    // Notification state
    let hasNewNotifications = false;
    
    // Update badge visibility (red dot only when there are new notifications)
    function updateNotificationBadges() {
        const badgeClass = hasNewNotifications ? 'has-notifications' : '';
        
        if (desktopBadge) {
            desktopBadge.className = `notification-badge ${badgeClass}`;
        }
        
        if (mobileBadge) {
            mobileBadge.className = `notification-badge ${badgeClass}`;
        }
    }
    
    // Click handlers for notification buttons
    function handleNotificationClick(e) {
        e.preventDefault();
        
        // Clear the red dot when user clicks to view notifications
        hasNewNotifications = false;
        updateNotificationBadges();
        
        // Add click animation
        const button = e.currentTarget;
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = '';
            
            // Navigate to notifications page
            window.location.href = 'notifications.html';
        }, 150);
    }
    
    // Add event listeners
    if (desktopNotificationBtn) {
        desktopNotificationBtn.addEventListener('click', handleNotificationClick);
    }
    
    if (mobileNotificationBtn) {
        mobileNotificationBtn.addEventListener('click', handleNotificationClick);
    }
    
    // Initialize badge display (no notifications by default)
    updateNotificationBadges();
    
    // Global function to show red dot when new notifications arrive
    window.showNewNotification = function() {
        hasNewNotifications = true;
        updateNotificationBadges();
        
        // Add subtle animation to indicate new notification
        [desktopBadge, mobileBadge].forEach(badge => {
            if (badge && badge.classList.contains('has-notifications')) {
                badge.style.animation = 'none';
                setTimeout(() => {
                    badge.style.animation = 'notificationPulse 2s infinite';
                }, 10);
            }
        });
        
        console.log('🔔 New notification added - red dot is now visible');
    };
    
    // Global function to hide red dot (when notifications are viewed)
    window.clearNotificationIndicator = function() {
        hasNewNotifications = false;
        updateNotificationBadges();
        console.log('🔔 Notification indicator cleared');
    };
    
    // Global function to check if there are new notifications
    window.hasNewNotifications = function() {
        return hasNewNotifications;
    };
    
    console.log('🔔 Notification system initialized');
    console.log('💡 Use showNewNotification() to show red dot');
    console.log('💡 Use clearNotificationIndicator() to hide red dot');
}

// Advanced Particle System
function initAdvancedParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer || window.innerWidth < 768) return;
    
    const particlesCount = 100;
    const particles = [];
    
    // Create particle canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    particlesContainer.appendChild(canvas);
    
    function resizeCanvas() {
        canvas.width = particlesContainer.offsetWidth;
        canvas.height = particlesContainer.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class AdvancedParticle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.hue = Math.random() * 60 + 180; // Blue to cyan range
            this.life = 1;
            this.decay = Math.random() * 0.01 + 0.005;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            
            // Add some wave motion
            this.x += Math.sin(this.y * 0.01) * 0.5;
            
            if (this.life <= 0 || this.y > canvas.height + 10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity * this.life;
            ctx.beginPath();
            
            // Create gradient for particle
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 1)`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 70%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Create particles
    for (let i = 0; i < particlesCount; i++) {
        particles.push(new AdvancedParticle());
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.save();
                    ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    ctx.strokeStyle = '#00d4ff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Neural Network Background
function initNeuralNetwork() {
    const networkSvg = document.querySelector('.network-svg');
    if (!networkSvg || window.innerWidth < 768) return;
    
    const nodes = [];
    const connections = [];
    const nodeCount = 30;
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * 1920,
            y: Math.random() * 1080,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            pulse: Math.random() * Math.PI * 2
        });
    }
    
    // Create connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 300) {
                connections.push({ from: i, to: j, opacity: 0 });
            }
        }
    }
    
    function updateNetwork() {
        // Update nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            node.pulse += 0.02;
            
            // Bounce off edges
            if (node.x <= 0 || node.x >= 1920) node.vx *= -1;
            if (node.y <= 0 || node.y >= 1080) node.vy *= -1;
        });
        
        // Update connections
        connections.forEach(conn => {
            const nodeA = nodes[conn.from];
            const nodeB = nodes[conn.to];
            const dx = nodeA.x - nodeB.x;
            const dy = nodeA.y - nodeB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            conn.opacity = Math.max(0, (300 - distance) / 300 * 0.3);
        });
        
        renderNetwork();
        requestAnimationFrame(updateNetwork);
    }
    
    function renderNetwork() {
        networkSvg.innerHTML = `
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            ${connections.map(conn => {
                const nodeA = nodes[conn.from];
                const nodeB = nodes[conn.to];
                return `<line x1="${nodeA.x}" y1="${nodeA.y}" x2="${nodeB.x}" y2="${nodeB.y}" 
                        stroke="rgba(0,212,255,${conn.opacity})" stroke-width="1" filter="url(#glow)"/>`;
            }).join('')}
            ${nodes.map((node, i) => {
                const pulseSize = 2 + Math.sin(node.pulse) * 1;
                const opacity = 0.3 + Math.sin(node.pulse) * 0.2;
                return `<circle cx="${node.x}" cy="${node.y}" r="${pulseSize}" 
                        fill="rgba(0,212,255,${opacity})" filter="url(#glow)"/>`;
            }).join('')}
        `;
    }
    
    updateNetwork();
}

// Advanced Animations
function initAdvancedAnimations() {
    // Logo gear rotation with mouse interaction
    const mainGear = document.querySelector('.gear-rotating');
    let rotationSpeed = 1;
    
    if (mainGear) {
        mainGear.addEventListener('mouseenter', () => {
            rotationSpeed = 3;
            mainGear.style.animationDuration = '5s';
        });
        
        mainGear.addEventListener('mouseleave', () => {
            rotationSpeed = 1;
            mainGear.style.animationDuration = '15s';
        });
    }
    
    // Typewriter effect for tagline
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const text = "Advance step in MultiTech orientation";
        let index = 0;
        let isDeleting = false;
        
        function typeWriter() {
            const currentText = isDeleting 
                ? text.substring(0, index--) 
                : text.substring(0, index++);
            
            typewriterElement.textContent = currentText;
            
            if (!isDeleting && index > text.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && index < 0) {
                isDeleting = false;
                index = 0;
            }
            
            const speed = isDeleting ? 50 : 100;
            setTimeout(typeWriter, speed);
        }
        
        typeWriter();
    }
    
    // Advanced button hover effects
    document.querySelectorAll('.btn-primary-advanced').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 15px 40px rgba(0, 212, 255, 0.4)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.3)';
        });
    });
    
    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
    
    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            
            element.textContent = current + '+';
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
}

// Navbar background on scroll with advanced effects
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.advanced-nav');
    const scrollY = window.pageYOffset;
    
    if (scrollY > 100) {
        navbar.style.background = 'rgba(5, 5, 5, 0.98)';
        navbar.style.backdropFilter = 'blur(30px)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.background = 'rgba(5, 5, 5, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    }
});

// Advanced parallax effects
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Parallax for orbs
    document.querySelectorAll('.orb').forEach((orb, index) => {
        const speed = 0.3 + (index * 0.1);
        orb.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
    });
    
    // Parallax for floating elements
    document.querySelectorAll('.floating-elements > div').forEach((element, index) => {
        const speed = 0.2 + (index * 0.05);
        element.style.transform = `translate3d(0, ${scrolled * speed}px, 0) rotate(${scrolled * 0.1}deg)`;
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Advanced form handling
document.querySelector('.contact-form form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Advanced loading animation
    submitBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 10px;">
            <span style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid #fff; border-radius: 50%; animation: spin 1s linear infinite;"></span>
            Sending...
        </span>
    `;
    submitBtn.disabled = true;
    
    // Simulate form submission with advanced feedback
    setTimeout(() => {
        submitBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 10px;">
                <span style="color: #4ade80;">✓</span>
                Message Sent!
            </span>
        `;
        
        setTimeout(() => {
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }, 2000);
});

// Create scroll to top with advanced styling
function createAdvancedScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 15-6-6-6 6"/>
        </svg>
    `;
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #00d4ff, #4ecdc4);
        color: #000;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
            scrollBtn.style.transform = 'translateY(0) scale(1)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
            scrollBtn.style.transform = 'translateY(10px) scale(0.8)';
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
        this.style.boxShadow = '0 12px 30px rgba(0, 212, 255, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.3)';
    });
}

createAdvancedScrollToTop();

// Enhanced Tubelight Scroll Effect
function initTubelightScrollEffect() {
    const tubelight = document.getElementById('tubelight');
    const heroGlass = document.querySelector('.hero-glass-advanced');
    
    function updateTubelight() {
        const scrollPosition = window.scrollY;
        const triggerPoint = 150;
        
        if (scrollPosition > triggerPoint) {
            tubelight?.classList.add('glow');
            heroGlass?.classList.add('tubelight-active');
        } else {
            tubelight?.classList.remove('glow');
            heroGlass?.classList.remove('tubelight-active');
        }
    }
    
    // Throttled scroll event
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                updateTubelight();
                scrollTimeout = null;
            }, 16);
        }
    });
    
    // Initial call
    updateTubelight();
}// Performance optimization
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.glass-container, .event-item, .workshop-card, .team-card').forEach(el => {
    observer.observe(el);
});

console.log('🚀 Advanced GEC Tech Club Website Loaded Successfully!');
console.log('⚡ Enhanced with complex navigation and sophisticated graphics');
console.log('🎨 ASIMO logo and college emblem integrated with animations');
console.log('📱 Fully responsive with advanced mobile interactions');
console.log('🎯 Dynamic content system initialized');

// Global function to refresh gallery when new images are added
window.refreshGallery = function() {
    if (window.contentManager && window.contentManager.galleryManager) {
        const galleryContainer = document.querySelector('.gallery-grid');
        if (galleryContainer) {
            window.contentManager.galleryManager.refreshGallery(galleryContainer);
            console.log('🖼️ Gallery refreshed! New images should now be visible.');
        }
    } else {
        console.error('Gallery manager not initialized. Please refresh the page.');
    }
};

// Global function to validate all images in gallery
window.validateGalleryImages = function() {
    if (window.contentManager && window.contentManager.galleryManager) {
        const galleryData = window.contentManager.galleryManager.galleryData;
        if (galleryData) {
            console.log('🔍 Validating gallery images...');
            galleryData.gallery.forEach(async (item, index) => {
                if (item.image) {
                    const exists = await window.contentManager.galleryManager.imageExists(item.image);
                    console.log(`${index + 1}. ${item.title}: ${exists ? '✅ Found' : '❌ Missing'} - ${item.image}`);
                }
            });
        }
    } else {
        console.error('Gallery manager not initialized. Please refresh the page.');
    }
};

// Instructions for users
console.log('💡 Tip: After adding images to gallery.json, call refreshGallery() in console to see changes immediately!');
console.log('💡 Tip: Call validateGalleryImages() to check which images are missing!');
console.log('🔔 Notification Management:');
console.log('   - addWorkshopNotification("Title", "Message", "link") - Add workshop notification');
console.log('   - addEventNotification("Title", "Message", "link") - Add event notification');
console.log('   - addAnnouncementNotification("Title", "Message", "link") - Add announcement');
console.log('   - showNewNotification() - Show red dot indicator');
console.log('   - clearNotificationIndicator() - Hide red dot indicator');

// Initialize all advanced features
function initializeAllAnimations() {
    initTubelightScrollEffect();
    
    // Apply ASIMO glow class to relevant elements
    setTimeout(() => {
        const titleElements = document.querySelectorAll('h1, h2, .logo-text, .hero-title');
        titleElements.forEach(element => {
            if (element.textContent.toLowerCase().includes('asimo')) {
                element.classList.add('asimo-text-glow');
            }
        });
    }, 1000);
}

// Scroll-triggered Color Effects for Events Section
function initScrollColorEffects() {
    const eventsSection = document.querySelector('.events-section');
    if (!eventsSection) return;

    function handleScroll() {
        const rect = eventsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress through the events section
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        // Trigger when section is 30% visible from top
        const triggerPoint = windowHeight * 0.7;
        
        if (elementTop < triggerPoint && (elementTop + elementHeight) > 0) {
            // Calculate intensity based on scroll position
            const scrollProgress = Math.max(0, Math.min(1, (triggerPoint - elementTop) / windowHeight));
            
            if (scrollProgress > 0.3) {
                eventsSection.classList.add('scroll-active');
            } else {
                eventsSection.classList.remove('scroll-active');
            }
        } else {
            eventsSection.classList.remove('scroll-active');
        }
    }

    // Throttled scroll handler for performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // ~60fps
        }
    }

    window.addEventListener('scroll', requestTick);
    handleScroll(); // Initial check
}

// Hero Text Scroll Effect - Zoom ASIMO text when scrolling
function initHeroTextScrollEffect() {
    const heroTitle = document.querySelector('.hero-title-advanced');
    if (!heroTitle) return;

    let ticking = false;

    function updateHeroText() {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Start effect after scrolling 20% of viewport height
        const triggerPoint = windowHeight * 0.2;
        
        if (scrollPosition > triggerPoint) {
            heroTitle.classList.add('scrolled');
        } else {
            heroTitle.classList.remove('scrolled');
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeroText);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
    updateHeroText(); // Initial check
}

// Section Tube Light Effects with Dark Overlay
function initSectionTubeLights() {
    const tubeLights = document.querySelectorAll('.section-tube-light');
    const darkOverlays = document.querySelectorAll('.section-dark-overlay');
    if (tubeLights.length === 0) return;

    let ticking = false;

    function updateTubeLights() {
        tubeLights.forEach((tubeLight, index) => {
            const section = tubeLight.closest('section');
            const darkOverlay = darkOverlays[index];
            if (!section || !darkOverlay) return;

            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if section is in viewport
            const isInView = rect.top < windowHeight && rect.bottom > 0;
            
            if (isInView) {
                // Calculate scroll progress for this section
                const sectionProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
                
                // Show tube light when section enters viewport
                tubeLight.style.opacity = Math.min(1, sectionProgress * 2);
                
                // Control dark overlay - start dark and fade as section is scrolled
                const overlayOpacity = Math.max(0, 1 - sectionProgress);
                darkOverlay.style.opacity = overlayOpacity;
                
                // Calculate new dimensions for the tube light
                const scrollFactor = sectionProgress * 100;
                const newWidth = Math.min(100, 20 + scrollFactor * 0.5); // vw for width
                const newHeight = Math.min(8, 8 + scrollFactor * 0.2); // px for height

                // Calculate new light intensity and spread for the glow
                const closeShadowBlur = Math.min(25, 10 + scrollFactor * 0.15);
                const closeShadowOpacity = Math.min(1, 0.7 + scrollFactor * 0.003);

                // For the wider, fading glow (trapezoidal effect)
                const farShadowVerticalOffset = Math.min(50, 15 + scrollFactor * 0.2);
                const farShadowBlur = Math.min(100, 40 + scrollFactor * 0.5);
                const farShadowSpread = Math.min(40, 15 + scrollFactor * 0.25);
                const farShadowOpacity = Math.min(0.6, 0.3 + scrollFactor * 0.003);

                // Apply the new styles to the tube light
                tubeLight.style.width = newWidth + 'vw';
                tubeLight.style.height = newHeight + 'px';

                // Update the box-shadow to make the light grow
                tubeLight.style.boxShadow = 
                    `0px 5px ${closeShadowBlur}px 0px rgba(255, 255, 224, ${closeShadowOpacity}), ` +
                    `0px ${farShadowVerticalOffset}px ${farShadowBlur}px ${farShadowSpread}px rgba(255, 255, 224, ${farShadowOpacity})`;
            } else {
                // Reset tube light when section is out of view
                tubeLight.style.opacity = 0;
                tubeLight.style.width = '200px';
                tubeLight.style.height = '8px';
                tubeLight.style.boxShadow = 
                    '0px 5px 10px 0px rgba(255, 255, 224, 0.7), ' +
                    '0px 15px 40px 15px rgba(255, 255, 224, 0.3)';
                
                // Reset dark overlay to full opacity when out of view
                darkOverlay.style.opacity = 1;
            }
        });
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateTubeLights);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
    updateTubeLights(); // Initial check
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAllAnimations();
});

// Also initialize on window load
window.addEventListener('load', function() {
    initializeAllAnimations();
});

// Function to initialize dynamic content interactions
function initializeDynamicInteractions() {
    // Quotes Carousel Functionality
    const quotes = document.querySelectorAll('.quote-card');
    if (quotes.length > 0) {
        updateQuotesDisplay();
        
        // Auto-advance quotes every 5 seconds
        setInterval(() => {
            changeQuote(1);
        }, 5000);
    }

    // Batch card click handlers
    document.querySelectorAll('.batch-card').forEach(card => {
        card.addEventListener('click', function() {
            const batch = this.getAttribute('data-batch');
            console.log(`Navigating to ${batch} team page...`);
            
            // Navigate to teams.html page with specific batch
            window.location.href = `teams.html?batch=${batch}#batch-${batch}`;
        });
    });
    
    // Workshop button interactions (preserved from original)
    document.querySelectorAll('.workshop-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.workshop-card');
            const title = card.querySelector('h3').textContent;
            
            // Create advanced modal effect (preserved from original)
            const modal = document.createElement('div');
            modal.className = 'workshop-modal'; // Add class for easier targeting
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div style="
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 500px;
                    text-align: center;
                    color: white;
                    transform: scale(0.8);
                    transition: transform 0.3s ease;
                ">
                    <h3 style="color: #00d4ff; margin-bottom: 20px;">${title}</h3>
                    <p style="margin-bottom: 30px; color: rgba(255, 255, 255, 0.8);">
                        This would typically open a detailed page with workshop information, 
                        registration details, curriculum, and instructor profiles.
                    </p>
                    <button class="workshop-close-btn" 
                            style="
                                background: linear-gradient(135deg, #00d4ff, #4ecdc4);
                                border: none;
                                padding: 12px 24px;
                                border-radius: 25px;
                                color: #000;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            ">
                        Close
                    </button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add click event to close button
            const closeBtn = modal.querySelector('.workshop-close-btn');
            closeBtn.addEventListener('click', function() {
                modal.style.opacity = '0';
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                }, 300);
            });
            
            // Add hover effect to close button
            closeBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 212, 255, 0.4)';
            });
            
            closeBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
            
            // Add click event to modal background to close
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        if (modal.parentNode) {
                            modal.parentNode.removeChild(modal);
                        }
                    }, 300);
                }
            });
            
            // Add escape key to close modal
            const handleEscape = function(e) {
                if (e.key === 'Escape') {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        if (modal.parentNode) {
                            modal.parentNode.removeChild(modal);
                        }
                    }, 300);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
            
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.querySelector('div').style.transform = 'scale(1)';
            }, 10);
        });
    });
}

// Quotes Carousel Functionality
let currentQuote = 0;

function updateQuotesDisplay() {
    const quotes = document.querySelectorAll('.quote-card');
    const totalQuotes = quotes.length;
    
    if (totalQuotes === 0) return;

    quotes.forEach((quote, index) => {
        quote.classList.remove('active');
        
        if (index === currentQuote) {
            quote.classList.add('active');
            quote.style.zIndex = '3';
            quote.style.opacity = '1';
            quote.style.transform = 'rotateY(0deg) translateX(0px) translateZ(0px)';
        } else if (index === (currentQuote + 1) % totalQuotes) {
            quote.style.zIndex = '2';
            quote.style.opacity = '0.7';
            quote.style.transform = 'rotateY(15deg) translateX(20px) translateZ(-50px)';
        } else if (index === (currentQuote - 1 + totalQuotes) % totalQuotes) {
            quote.style.zIndex = '1';
            quote.style.opacity = '0.4';
            quote.style.transform = 'rotateY(-15deg) translateX(-20px) translateZ(-50px)';
        } else {
            quote.style.zIndex = '0';
            quote.style.opacity = '0';
            quote.style.transform = 'rotateY(-30deg) translateX(-40px) translateZ(-100px)';
        }
    });
}

function changeQuote(direction) {
    const quotes = document.querySelectorAll('.quote-card');
    const totalQuotes = quotes.length;
    
    if (totalQuotes === 0) return;
    
    currentQuote = (currentQuote + direction + totalQuotes) % totalQuotes;
    updateQuotesDisplay();
}


