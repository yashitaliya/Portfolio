/**
 * Portfolio Animations - Smooth scroll reveals
 * Gold accent theme with colorful elements
 */

// ============================================
// HERO 3D SCENE (Three.js) - Gold wireframes
// ============================================
class HeroScene {
    constructor() {
        this.container = document.getElementById('hero-canvas-container');
        if (!this.container) return;

        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.scrollProgress = 0;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth < 768;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            50,
            this.container.offsetWidth / this.container.offsetHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        this.createGeometry();
        this.setupEventListeners();

        if (!this.isReducedMotion) {
            this.animate();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    createGeometry() {
        // Check if light mode is active
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

        // Tech Blue colors based on theme
        const mainColor = isLightMode ? 0x0284c7 : 0x0ea5e9;
        const secondaryColor = isLightMode ? 0x0ea5e9 : 0x38bdf8;
        const opacity = isLightMode ? 0.25 : 0.15;

        // Create a network of nodes (Tech/Developer look)
        this.particles = [];
        this.lines = [];

        // Create nodes (particles)
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: mainColor,
            transparent: true,
            opacity: 0.6
        });

        // Create 60 particles in a cloud
        for (let i = 0; i < 60; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());

            // Random position in a sphere
            const r = 4 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            particle.position.x = r * Math.sin(phi) * Math.cos(theta);
            particle.position.y = r * Math.sin(phi) * Math.sin(theta);
            particle.position.z = r * Math.cos(phi) - 2; // Push back slightly

            // Store velocity for animation
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                ),
                originalPos: particle.position.clone()
            };

            this.particles.push(particle);
            this.scene.add(particle);
        }

        // Create lines connecting close particles
        const lineMaterial = new THREE.LineBasicMaterial({
            color: secondaryColor,
            transparent: true,
            opacity: 0.15
        });

        // We'll create a line object that will be updated every frame
        // Instead of creating thousands of line objects, we use BufferGeometry
        const geometry = new THREE.BufferGeometry();
        // Max possible connections (just an estimate buffer size)
        const positions = new Float32Array(60 * 60 * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        this.lineMesh = new THREE.LineSegments(geometry, lineMaterial);
        this.scene.add(this.lineMesh);

        // Add some floating geometric shapes for "tech" feel
        const geoShapes = [
            new THREE.IcosahedronGeometry(0.3, 0),
            new THREE.OctahedronGeometry(0.3, 0),
            new THREE.TetrahedronGeometry(0.3, 0)
        ];

        this.floatingShapes = [];
        for (let i = 0; i < 5; i++) {
            const shape = new THREE.Mesh(
                geoShapes[Math.floor(Math.random() * geoShapes.length)],
                new THREE.MeshBasicMaterial({
                    color: secondaryColor,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.3
                })
            );

            shape.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 2 - 2
            );

            shape.userData = {
                rotSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02
                }
            };

            this.floatingShapes.push(shape);
            this.scene.add(shape);
        }
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            this.targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        window.addEventListener('scroll', () => {
            const heroHeight = this.container.offsetHeight;
            this.scrollProgress = Math.min(window.scrollY / heroHeight, 1);
        });

        window.addEventListener('resize', () => this.onResize());

        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateThemeColors();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    updateThemeColors() {
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

        const mainColor = isLightMode ? 0x0284c7 : 0x0ea5e9;
        const secondaryColor = isLightMode ? 0x0ea5e9 : 0x38bdf8;
        const opacity = isLightMode ? 0.25 : 0.15;

        // Update particles
        if (this.particles) {
            this.particles.forEach(p => {
                p.material.color.setHex(mainColor);
                p.material.opacity = 0.6; // Keep particles visible
            });
        }

        // Update lines
        if (this.lineMesh) {
            this.lineMesh.material.color.setHex(secondaryColor);
            this.lineMesh.material.opacity = 0.15;
        }

        // Update floating shapes
        if (this.floatingShapes) {
            this.floatingShapes.forEach(shape => {
                shape.material.color.setHex(secondaryColor);
                shape.material.opacity = 0.3;
            });
        }
    }

    onResize() {
        if (!this.container) return;
        this.isMobile = window.innerWidth < 768;
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.0005;

        // Smooth mouse interpolation
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Animate particles and update lines
        if (this.particles && this.particles.length > 0) {
            const positions = this.lineMesh.geometry.attributes.position.array;
            let lineIndex = 0;

            // Update particle positions
            this.particles.forEach((particle, i) => {
                // Move particles
                particle.position.add(particle.userData.velocity);

                // Boundary check - bounce back
                if (Math.abs(particle.position.x) > 6) particle.userData.velocity.x *= -1;
                if (Math.abs(particle.position.y) > 4) particle.userData.velocity.y *= -1;
                if (Math.abs(particle.position.z + 2) > 3) particle.userData.velocity.z *= -1;

                // Mouse interaction - repel
                const dx = particle.position.x - this.mouse.x * 5;
                const dy = particle.position.y - (-this.mouse.y * 5);
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 2) {
                    particle.position.x += dx * 0.01;
                    particle.position.y += dy * 0.01;
                }

                // Connect lines to nearby particles
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const d = particle.position.distanceTo(p2.position);

                    if (d < 2.5) {
                        // Add line segment
                        positions[lineIndex++] = particle.position.x;
                        positions[lineIndex++] = particle.position.y;
                        positions[lineIndex++] = particle.position.z;

                        positions[lineIndex++] = p2.position.x;
                        positions[lineIndex++] = p2.position.y;
                        positions[lineIndex++] = p2.position.z;
                    }
                }
            });

            // Clear remaining lines
            for (let k = lineIndex; k < positions.length; k++) {
                positions[k] = 0;
            }

            this.lineMesh.geometry.attributes.position.needsUpdate = true;
        }

        // Animate floating shapes
        if (this.floatingShapes) {
            this.floatingShapes.forEach((shape, i) => {
                shape.rotation.x += shape.userData.rotSpeed.x;
                shape.rotation.y += shape.userData.rotSpeed.y;
                shape.position.y += Math.sin(time + i) * 0.002;
            });
        }

        // Camera parallax based on mouse
        this.camera.position.x = this.mouse.x * 0.5;
        this.camera.position.y = -this.mouse.y * 0.5;
        this.camera.position.z = 5 - this.scrollProgress * 2;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}


// ============================================
// SIMPLE SCROLL ANIMATIONS - No reverse/toggle issues
// ============================================
class ScrollAnimations {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.isReducedMotion) {
            this.showAllElements();
            return;
        }

        this.init();
    }

    showAllElements() {
        // If reduced motion, show everything
        document.querySelectorAll('.portfolio-item, .service-card, .education-item, .skill-tag, .certificate-card').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded');
            this.showAllElements();
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Set all portfolio items visible initially to prevent flash
        gsap.set('.portfolio-item', { opacity: 1 });

        // Run animations
        this.animateHero();
        this.initHeroTextReveal();
        this.animateSections();
        this.animatePortfolio();
        this.animateServices();
        this.animateProcess();
        this.animateEducation();
        this.animateSkills();
        this.animateContact();
        this.initWorkflowAnimation();
        this.initParallax();
    }

    // Hero entrance animation (handled by CSS for better performance)
    animateHero() {
        // Hero animations now handled by CSS keyframes for better initial load performance
        // See hero.css for @keyframes fadeInUp, fadeInDown, scaleIn animations
        return;
    }

    // Section headers animation
    animateSections() {
        gsap.utils.toArray('.section-header').forEach((header) => {
            const title = header.querySelector('.section-title');
            const subtitle = header.querySelector('.section-subtitle');

            if (title) {
                gsap.fromTo(title,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: header,
                            start: 'top 85%',
                            once: true // Only animate once, stays visible
                        }
                    }
                );
            }

            if (subtitle) {
                gsap.fromTo(subtitle,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: 0.15,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: header,
                            start: 'top 85%',
                            once: true
                        }
                    }
                );
            }
        });

        // About section
        const aboutImage = document.querySelector('.about-image');
        const aboutText = document.querySelector('.about-text');

        if (aboutImage) {
            gsap.fromTo(aboutImage,
                { opacity: 0, x: -60 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.9,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.about-content',
                        start: 'top 80%',
                        once: true
                    }
                }
            );
        }

        if (aboutText) {
            gsap.fromTo(aboutText,
                { opacity: 0, x: 60 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.9,
                    delay: 0.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.about-content',
                        start: 'top 80%',
                        once: true
                    }
                }
            );
        }

        // Info items
        gsap.fromTo('.info-item',
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.about-info',
                    start: 'top 85%',
                    once: true
                }
            }
        );
    }

    // Portfolio items - Fixed to stay visible
    animatePortfolio() {
        const portfolioItems = gsap.utils.toArray('.portfolio-item');

        portfolioItems.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, y: 60, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        once: true // KEY: Only plays once, stays visible
                    }
                }
            );
        });

        // Filter buttons
        gsap.fromTo('.filter-btn',
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.portfolio-filter',
                    start: 'top 90%',
                    once: true
                }
            }
        );
    }

    // Services cards
    animateServices() {
        const serviceCards = gsap.utils.toArray('.service-card');

        serviceCards.forEach((card, index) => {
            gsap.fromTo(card,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.services-grid',
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });
    }

    // Process cards
    animateProcess() {
        const processCards = gsap.utils.toArray('.process-card');

        processCards.forEach((card, index) => {
            gsap.fromTo(card,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.process-grid',
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });
    }

    // Education items
    animateEducation() {
        const educationItems = gsap.utils.toArray('.education-item');

        educationItems.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });
    }

    // Skills and certificates
    animateSkills() {
        const skillCategories = gsap.utils.toArray('.skill-category');

        skillCategories.forEach((cat, index) => {
            gsap.fromTo(cat,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.skills-container',
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });

        // Certificate cards
        const certCards = gsap.utils.toArray('.certificate-card');
        certCards.forEach((card, index) => {
            gsap.fromTo(card,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.certificates-flow',
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });
    }

    // Contact section
    animateContact() {
        gsap.fromTo('.contact-info',
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.contact-content',
                    start: 'top 80%',
                    once: true
                }
            }
        );

        gsap.fromTo('.contact-form-wrapper',
            { opacity: 0, x: 50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                delay: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.contact-content',
                    start: 'top 80%',
                    once: true
                }
            }
        );

        gsap.fromTo('.contact-item',
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.contact-details',
                    start: 'top 85%',
                    once: true
                }
            }
        );

        gsap.fromTo('.social-link',
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: '.social-links',
                    start: 'top 90%',
                    once: true
                }
            }
        );
    }
}


// ============================================
// INITIALIZE ON DOM LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js hero scene
    if (typeof THREE !== 'undefined') {
        new HeroScene();
    }

    // Initialize scroll animations
    setTimeout(() => {
        new ScrollAnimations();
    }, 100);
});
