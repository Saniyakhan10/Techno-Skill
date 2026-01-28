// Contact Form Handler
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form-main');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

function handleContactSubmit(e) {
    e.preventDefault();

    // Get Form Data using Name attributes
    const formData = {
        name: e.target.elements['name'].value,
        email: e.target.elements['email'].value,
        subject: e.target.elements['subject'].value,
        message: e.target.elements['message'].value
    };

    // Save to LocalStorage (Admin visibility)
    if (typeof saveContactInquiry === 'function') {
        saveContactInquiry(formData);
    }

    // Visual feedback
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#10b981';

        // Reset form
        e.target.reset();

        // Optional: Show a nice success message instead of alert
        showCustomAlert('Your message has been sent successfully! Our team will contact you soon.');

        // Revert button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }, 1500);
}

function showCustomAlert(msg) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #10b981;
        color: white;
        padding: 15px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        animation: slideUp 0.5s ease;
    `;
    alertDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    document.body.appendChild(alertDiv);

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transition = '0.5s';
        setTimeout(() => alertDiv.remove(), 500);
    }, 4000);
}
