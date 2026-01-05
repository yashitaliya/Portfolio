// Main JavaScript - Core functionality

// Main functionality
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.header-nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 968) {
                if (nav) {
                    nav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Contact form submission is handled in `js/contact.js` (EmailJS).
    // The older inline alert/reset handler was removed to avoid duplicate handlers.

    // Animate skill bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Animate education items on scroll
    const educationObserver = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                educationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });

    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        educationObserver.observe(item);
    });

    // Portfolio filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            let visibleCount = 0;
            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === filterValue) {
                        item.classList.remove('hidden');
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }
                }
            });

            const grid = document.querySelector('.portfolio-grid');
            if (grid) {
                if (visibleCount === 1) {
                    grid.classList.add('single-item');
                } else {
                    grid.classList.remove('single-item');
                }
            }
        });
    });

    // Subtle 3D tilt for interactive cards - DISABLED for performance
    function initTiltForCards(selector, maxTilt) {
        // No-op to prevent jank
        return;
    }

    initTiltForCards('.service-card', 6);
    initTiltForCards('.portfolio-item', 5);

    // Developer Console Logic
    const consoleInput = document.getElementById('devConsoleInput');
    const consoleOutput = document.getElementById('devConsoleOutput');
    const consoleForm = document.getElementById('devConsoleForm');

    if (consoleInput && consoleOutput && consoleForm) {
        const commands = {
            help: "Available commands: about, skills, projects, contact, theme, clear",
            about: "I am a passionate Software Engineer specializing in full-stack development.",
            skills: "Core: Java, Flutter, Python, Web (HTML/CSS/JS), SQL.",
            projects: "Check out the Portfolio section for WordWave, ChatBuddy, and more.",
            contact: "Email: italiyayash1717@gmail.com | Phone: +91 90164 10199",
            theme: "Toggles light/dark mode.",
            clear: "clear"
        };

        consoleForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = consoleInput.value.trim().toLowerCase();

            if (!input) return;

            // Add user command line
            const commandLine = document.createElement('div');
            commandLine.className = 'dev-line';
            commandLine.innerHTML = `<span class="dev-prompt">$</span> ${input}`;
            consoleOutput.appendChild(commandLine);

            // Process command
            if (input === 'clear') {
                consoleOutput.innerHTML = '<div class="dev-line">$ Console cleared. Type <span class="dev-command">help</span></div>';
            } else if (input === 'theme') {
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) themeToggle.click();
                const responseLine = document.createElement('div');
                responseLine.className = 'dev-line';
                responseLine.textContent = "Theme toggled.";
                consoleOutput.appendChild(responseLine);
            } else if (commands[input]) {
                const responseLine = document.createElement('div');
                responseLine.className = 'dev-line';
                responseLine.style.color = 'var(--text-secondary)';
                responseLine.innerHTML = commands[input];
                consoleOutput.appendChild(responseLine);
            } else {
                const responseLine = document.createElement('div');
                responseLine.className = 'dev-line';
                responseLine.style.color = '#ef4444';
                responseLine.textContent = `Command not found: ${input}. Type 'help'.`;
                consoleOutput.appendChild(responseLine);
            }

            // Scroll to bottom
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            consoleInput.value = '';
        });
    }
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
    document.head.appendChild(script);
}
