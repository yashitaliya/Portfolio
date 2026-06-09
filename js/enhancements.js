/**
 * Enhanced Portfolio Animations
 * Additional professional animations and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initNumberCounters();
    initEnhancedHoverEffects();
    initFormEnhancements();
    initReducedMotionSupport();
});

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Animated number counters for statistics
 */
function initNumberCounters() {
    if (typeof gsap === 'undefined') return;
    
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const duration = 2;
        
        gsap.fromTo(stat, 
            { textContent: 0 },
            {
                textContent: target,
                duration: duration,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    once: true
                },
                onUpdate: function() {
                    stat.textContent = Math.ceil(stat.textContent) + '+';
                }
            }
        );
    });
}

/**
 * Enhanced hover effects for interactive elements
 */
function initEnhancedHoverEffects() {
    // Service card icon animation on hover
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const icon = card.querySelector('.service-icon');
        
        if (icon) {
            card.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(icon, {
                        scale: 1.1,
                        rotation: 5,
                        duration: 0.3,
                        ease: 'back.out(1.7)'
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(icon, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        }
    });
    
    // Portfolio filter buttons - enhanced active state
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active from all
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (typeof gsap !== 'undefined') {
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.2
                    });
                }
            });
            
            // Add active to clicked
            this.classList.add('active');
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(this, 
                    { scale: 0.95 },
                    { 
                        scale: 1,
                        duration: 0.3,
                        ease: 'back.out(1.7)'
                    }
                );
            }
        });
    });
}

/**
 * Form input enhancements
 */
function initFormEnhancements() {
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    
    formInputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    scale: 1.01,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            }
        });
        
        // Remove focus effect
        input.addEventListener('blur', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            }
        });
        
        // Add filled class when input has value
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
    });
    
    // Enhanced submit button
    const submitButton = document.querySelector('.btn-submit');
    
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('button-ripple');
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }
}

/**
 * Respect user's reduced motion preference
 */
function initReducedMotionSupport() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion(e) {
        if (e.matches) {
            // Disable animations
            document.body.classList.add('reduce-motion');
            
            // Stop GSAP animations
            if (typeof gsap !== 'undefined') {
                gsap.globalTimeline.timeScale(100); // Speed up massively (instant)
            }
        } else {
            document.body.classList.remove('reduce-motion');
            
            if (typeof gsap !== 'undefined') {
                gsap.globalTimeline.timeScale(1); // Normal speed
            }
        }
    }
    
    // Check on load
    handleReducedMotion(mediaQuery);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleReducedMotion);
}

/**
 * Add scroll progress indicator (optional)
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        
        const bar = document.querySelector('.scroll-progress-bar');
        if (bar) {
            bar.style.width = scrolled + '%';
        }
    });
}

// Uncomment to enable scroll progress indicator
// initScrollProgress();
