// Navigation JavaScript - Smooth scrolling and active section highlighting

document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Sliding Marker Logic
    const marker = document.querySelector('.nav-marker');
    const nav = document.querySelector('.header-nav');

    function moveMarker(element) {
        if (marker && element && nav) {
            // Calculate relative position to nav container
            const navRect = nav.getBoundingClientRect();
            const linkRect = element.getBoundingClientRect();
            const left = linkRect.left - navRect.left;

            marker.style.width = `${linkRect.width}px`;
            marker.style.transform = `translateX(${left}px)`;
        } else if (marker) {
            marker.style.width = '0';
        }
    }

    function highlightActiveSection() {
        const scrollY = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;

        let foundActive = false;

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
                        moveMarker(link); // Move marker to active
                        foundActive = true;
                    }
                });
            }
        });

        // If at top or no section active, reset or highlight home
        if (!foundActive && scrollY < 100) {
            const homeLink = document.querySelector('a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
                moveMarker(homeLink);
            }
        }
    }

    // Hover effect for marker
    navLinksArray.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            moveMarker(e.target);
        });
    });

    // Reset to active on mouse leave
    if (nav) {
        nav.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.nav-link.active');
            moveMarker(activeLink);
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

    // Throttle scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                highlightActiveSection();
                updateHeaderOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Update on resize
    window.addEventListener('resize', () => {
        setHeaderHeight();
        const activeLink = document.querySelector('.nav-link.active');
        moveMarker(activeLink);
    });

    // Highlight active section on page load
    // Small delay to ensure layout is ready
    setTimeout(() => {
        highlightActiveSection();
        updateHeaderOnScroll();
    }, 100);
});

