// Navigation JavaScript - Smooth scrolling and active section highlighting

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = document.querySelectorAll('.nav-link');

    // Header element for dynamic height and scrolled state
    const header = document.querySelector('.header');

    // Set CSS variable --header-height from actual header height so CSS can use it
    function setHeaderHeight() {
        if (header) {
            const h = header.offsetHeight + 'px';
            document.documentElement.style.setProperty('--header-height', h);
        }
    }
    // Initial set and on resize
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

    function highlightActiveSection() {
        const scrollY = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionId = section.getAttribute('id');
            const sectionBottom = sectionTop + sectionHeight;

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navLinksArray.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Toggle a compact header style when scrolling down
    function updateHeaderOnScroll() {
        if (!header) return;
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Header background on scroll - removed since header is always visible now

    // Throttle scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                highlightActiveSection();
                updateHeaderOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Highlight active section on page load
    highlightActiveSection();
    // Ensure header scrolled state is correct on load
    updateHeaderOnScroll();
});

