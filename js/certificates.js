document.addEventListener('DOMContentLoaded', () => {
    const certificatesFlow = document.querySelector('.certificates-flow');
    let isScrolling = false;
    let startX;
    let scrollLeft;

    // Mouse events for desktop
    certificatesFlow.addEventListener('mousedown', (e) => {
        isScrolling = true;
        startX = e.pageX - certificatesFlow.offsetLeft;
        scrollLeft = certificatesFlow.scrollLeft;
        certificatesFlow.style.cursor = 'grabbing';
    });

    certificatesFlow.addEventListener('mouseleave', () => {
        isScrolling = false;
        certificatesFlow.style.cursor = 'grab';
    });

    certificatesFlow.addEventListener('mouseup', () => {
        isScrolling = false;
        certificatesFlow.style.cursor = 'grab';
    });

    certificatesFlow.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - certificatesFlow.offsetLeft;
        const walk = (x - startX) * 2;
        certificatesFlow.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    certificatesFlow.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - certificatesFlow.offsetLeft;
        scrollLeft = certificatesFlow.scrollLeft;
    });

    certificatesFlow.addEventListener('touchend', () => {
        isScrolling = false;
    });

    certificatesFlow.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.touches[0].pageX - certificatesFlow.offsetLeft;
        const walk = (x - startX) * 2;
        certificatesFlow.scrollLeft = scrollLeft - walk;
    });

    // Set initial cursor style
    certificatesFlow.style.cursor = 'grab';

    // Add hover effect to certificates
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach(card => {
        const certBtn = card.querySelector('.cert-btn');
        
        card.addEventListener('click', (e) => {
            // Only trigger if the click wasn't on the button
            if (!e.target.closest('.cert-btn')) {
                certBtn.click();
            }
        });
    });
});