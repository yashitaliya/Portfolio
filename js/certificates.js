document.addEventListener('DOMContentLoaded', () => {
    // PDF Modal Elements
    const pdfModal = document.getElementById('pdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfViewerEmbed = document.getElementById('pdfViewerEmbed');
    const pdfModalTitle = document.getElementById('pdfModalTitle');
    const pdfModalClose = document.querySelector('.pdf-modal-close');
    const pdfModalOverlay = document.querySelector('.pdf-modal-overlay');
    const pdfModalBody = document.querySelector('.pdf-modal-body');
    const downloadPdfLink = document.getElementById('downloadPdfLink');

    // Certificate buttons
    const certButtons = document.querySelectorAll('.cert-btn');

    // Open PDF Modal
    certButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfUrl = btn.getAttribute('href');
            let title = btn.getAttribute('data-cert-title');
            
            // Clean up the title (remove .pdf extension if present)
            if (title) {
                title = title.replace('.pdf', '');
            } else {
                // Fallback: extract from URL
                title = pdfUrl.split('/').pop().replace('.pdf', '');
            }
            
            openPdfModal(pdfUrl, title);
        });
    });

    // Close Modal Functions
    const closePdfModal = () => {
        pdfModal.classList.remove('active');
        pdfModalBody.classList.remove('loading');
        // Immediately clear the PDF to prevent caching
        pdfViewer.data = '';
        pdfViewerEmbed.src = '';
    };

    pdfModalClose.addEventListener('click', closePdfModal);
    pdfModalOverlay.addEventListener('click', closePdfModal);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
            closePdfModal();
        }
    });

    // Open Modal Function
    function openPdfModal(pdfUrl, title) {
        // Clear previous PDF first
        pdfViewer.data = '';
        pdfViewerEmbed.src = '';
        
        pdfModalBody.classList.add('loading');
        pdfModalTitle.textContent = title;
        pdfModal.classList.add('active');
        
        // Add parameters to hide toolbar and fit PDF to viewer
        // Use a slight delay to ensure previous PDF is cleared
        setTimeout(() => {
            // Use direct URL without parameters for better compatibility
            const pdfUrlWithParams = pdfUrl;
            
            // Set PDF viewer source for both object and embed with better error handling
            pdfViewer.data = pdfUrlWithParams;
            pdfViewerEmbed.src = pdfUrlWithParams;
            downloadPdfLink.href = pdfUrl;
            
            // Add error handling for the embed element
            pdfViewerEmbed.addEventListener('error', handlePdfError, { once: true });
            
            // Remove loading state after a delay
            setTimeout(() => {
                pdfModalBody.classList.remove('loading');
            }, 500);
        }, 100);
    }

    // Error handler for PDF loading
    function handlePdfError() {
        console.warn('PDF failed to load, trying with download fallback');
        pdfModalBody.classList.remove('loading');
    }

    // Certificate Card Click (entire card is clickable)
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Only trigger if the click wasn't directly on the button
            if (!e.target.closest('.cert-btn')) {
                const certBtn = card.querySelector('.cert-btn');
                if (certBtn) {
                    certBtn.click();
                }
            }
        });
        
        // Add cursor pointer style
        card.style.cursor = 'pointer';
    });
});