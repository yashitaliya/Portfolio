document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formInputs = contactForm.querySelectorAll('.form-input');

    // Create a status message element
    const statusMessage = document.createElement('div');
    statusMessage.className = 'form-status';
    contactForm.appendChild(statusMessage);

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Get form data
        const formData = {
            name: contactForm.querySelector('input[name="name"]').value,
            email: contactForm.querySelector('input[name="email"]').value,
            subject: contactForm.querySelector('input[name="subject"]').value,
            message: contactForm.querySelector('textarea[name="message"]').value
        };

        try {
            // Send the form data using Email.js
            await emailjs.send(
                'service_lpxqzkh', // Replace with your Email.js service ID
                'template_syvkgju', // Replace with your Email.js template ID
                formData,
                'p2iGFPHOOIJQvQaag' // Replace with your Email.js public key
            );

            // Show success message
            statusMessage.className = 'form-status success';
            statusMessage.textContent = 'Message sent successfully!';

            // Reset form
            contactForm.reset();

        } catch (error) {
            console.error('Error:', error);
            // Show error message
            statusMessage.className = 'form-status error';
            statusMessage.textContent = 'Failed to send message. Please try again.';
        }

        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';

        // Hide status message after 5 seconds
        setTimeout(() => {
            statusMessage.className = 'form-status';
            statusMessage.textContent = '';
        }, 5000);
    });

    // Real-time validation
    const validators = {
        name: (value) => value.trim().length >= 2,
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        subject: (value) => value.trim().length >= 4,
        message: (value) => value.trim().length >= 10
    };

    formInputs.forEach(input => {
        const fieldName = input.name;

        input.addEventListener('input', function () {
            const value = this.value;

            // Remove both classes first
            this.classList.remove('valid', 'invalid');

            if (value.trim() === '') {
                // Empty - no validation state
                return;
            }

            // Validate based on field type
            if (validators[fieldName]) {
                if (validators[fieldName](value)) {
                    this.classList.add('valid');
                } else {
                    this.classList.add('invalid');
                }
            }
        });

        // Validate on blur for better UX
        input.addEventListener('blur', function () {
            const value = this.value;
            this.classList.remove('valid', 'invalid');

            if (value.trim() !== '' && validators[fieldName]) {
                if (validators[fieldName](value)) {
                    this.classList.add('valid');
                } else {
                    this.classList.add('invalid');
                }
            }
        });
    });
});