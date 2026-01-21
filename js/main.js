// Main JavaScript file - Common functionality across all pages

// DOM ready function
document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile menu
    initMobileMenu();

    // Update navigation counts
    updateWishlistCount();
    updateCompareCount();

    // Set current page active link
    setActiveNavLink();

    // Add notification styles if not present
    addNotificationStyles();

    // Apply generic image fallbacks (prevents broken image icons)
    applyImageFallbacks();
});

function getFallbackImageDataUrl(type = 'generic') {
    let label = 'IMAGE';
    if (type === 'course') label = 'COURSE';
    if (type === 'mentor') label = 'MENTOR';
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f5f7ff"/>
                    <stop offset="1" stop-color="#e9eaff"/>
                </linearGradient>
            </defs>
            <rect width="1200" height="675" fill="url(#g)"/>
            <rect x="60" y="60" width="1080" height="555" rx="28" fill="white" opacity="0.85"/>
            <g fill="#8c52ff" opacity="0.9">
                <path d="M600 230l220 85-220 85-220-85 220-85zm-170 120v110c0 60 340 60 340 0V350l-170 65-170-65z"/>
            </g>
            <text x="600" y="520" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="46" fill="#6a3fd8" font-weight="700">${label}</text>
        </svg>
    `.trim();

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function applyImageFallbacks() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
        // Skip if a handler is already attached
        if (img.dataset.fallbackBound === '1') return;
        img.dataset.fallbackBound = '1';

        // Set up the error listener
        const handleError = () => {
            if (img.dataset.fallbackApplied === '1') return;
            img.dataset.fallbackApplied = '1';
            const type = img.dataset.fallback || 'generic';
            img.src = getFallbackImageDataUrl(type);
        };

        img.addEventListener('error', handleError);

        // Immediate check if image is already broken
        if (img.complete && (img.naturalHeight === 0 || img.naturalWidth === 0)) {
            handleError();
        }
    });
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) {
        console.log('Hamburger or nav-menu not found');
        return;
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        const isActive = navMenu.classList.contains('active');

        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Don't close if it's a dropdown or has submenu
            if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                return;
            }
            closeMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        const isActive = navMenu.classList.contains('active');

        if (!isClickInsideMenu && !isClickOnHamburger && isActive) {
            closeMenu();
        }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    function openMenu() {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        hamburger.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden';

        // Add backdrop
        if (!document.querySelector('.nav-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'nav-backdrop';
            document.body.appendChild(backdrop);
            setTimeout(() => backdrop.classList.add('active'), 10);

            backdrop.addEventListener('click', closeMenu);
        }
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';

        // Remove backdrop
        const backdrop = document.querySelector('.nav-backdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
            setTimeout(() => backdrop.remove(), 300);
        }
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');

        if (currentPage === linkHref ||
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Toggle wishlist status
function toggleWishlist(courseId) {
    if (isInWishlist(courseId)) {
        removeFromWishlist(courseId);
        showNotification('Course removed from wishlist', 'info');
    } else {
        addToWishlist(courseId);
        showNotification('Course added to wishlist', 'success');
    }

    // Update all wishlist buttons for this course (works with both old and new card styles)
    const wishlistButtons = document.querySelectorAll(`[onclick="toggleWishlist(${courseId})"]`);
    wishlistButtons.forEach(btn => {
        const isNowInWishlist = isInWishlist(courseId);

        // Update button state
        if (isNowInWishlist) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        // Update icon
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isNowInWishlist ? 'fas fa-heart' : 'far fa-heart';
            // Ensure heart is red when active
            icon.style.color = isNowInWishlist ? '#ef4444' : '';
        }

        // Do NOT change text content as requested
    });

    // If on wishlist page, reload the list
    if (window.location.pathname.includes('wishlist.html')) {
        loadWishlistCourses();
    }
}

// Add to compare list
function addToCompareList(courseId) {
    const result = addToCompare(courseId);
    showNotification(result.message, result.success ? 'success' : 'warning');

    // If on compare page, reload the comparison
    if (window.location.pathname.includes('compare.html')) {
        loadComparisonTable();
    }
}

// Remove from compare list
function removeFromCompareList(courseId) {
    removeFromCompare(courseId);
    showNotification('Course removed from comparison', 'info');

    // If on compare page, reload the comparison
    if (window.location.pathname.includes('compare.html')) {
        loadComparisonTable();
    }
}

// Clear all comparisons
function clearComparison() {
    if (getCompareList().length === 0) {
        showNotification('Comparison list is already empty', 'info');
        return;
    }

    if (confirm('Are you sure you want to clear all comparisons?')) {
        clearCompare();
        showNotification('Comparison cleared', 'success');

        // If on compare page, reload
        if (window.location.pathname.includes('compare.html')) {
            loadComparisonTable();
        }
    }
}

// Buy course function
function buyCourse(courseId) {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Please login to purchase this course.');
        // Optional: Store intention to buy
        localStorage.setItem('redirectAfterLogin', 'checkout.html'); // Or handle this logic in login
        localStorage.setItem('selectedCourse', courseId.toString());
        window.location.href = 'login.html';
        return;
    }

    // Store selected course in localStorage for checkout
    localStorage.setItem('selectedCourse', courseId.toString());

    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Show notification message
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Add notification styles to document
function addNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 12px;
                color: white;
                z-index: 10000;
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-width: 320px;
                max-width: 450px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.25);
                transform: translateX(120%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                backdrop-filter: blur(10px);
            }
            .notification span {
                flex: 1;
                font-weight: 500;
                line-height: 1.4;
                word-break: break-word;
                margin-right: 10px;
            }
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            .notification-success { background: #28a745; }
            .notification-info { background: #17a2b8; }
            .notification-warning { background: #ffc107; color: #333; }
            .notification-error { background: #dc3545; }
            .notification button {
                background: none;
                border: none;
                color: inherit;
                font-size: 20px;
                cursor: pointer;
                margin-left: 15px;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .notification button:hover {
                opacity: 1;
            }
            @media (max-width: 768px) {
                .notification {
                    min-width: auto;
                    max-width: 90%;
                    left: 5%;
                    right: 5%;
                    top: 80px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Get current page name
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

// Calculate progress percentage
function calculateProgress(progress) {
    return Math.min(Math.max(progress, 0), 100);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Generate random number in range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Resource Data with Real PDF Links
const resourceData = {
    dsa: {
        title: "DSA Handwritten Notes",
        icon: "fas fa-cubes",
        // DSA Tutorial PDF
        pdfUrl: "https://www.tutorialspoint.com/data_structures_algorithms/data_structures_algorithms_tutorial.pdf"
    },
    java: {
        title: "Java Masterclass Notes",
        icon: "fab fa-java",
        // Java Tutorial PDF
        pdfUrl: "https://www.tutorialspoint.com/java/java_tutorial.pdf"
    },
    python: {
        title: "Python Zero to Hero",
        icon: "fab fa-python",
        // Python Tutorial PDF
        pdfUrl: "https://www.tutorialspoint.com/python/python_tutorial.pdf"
    },
    webdev: {
        title: "Full Stack Web Dev Guide",
        icon: "fas fa-laptop-code",
        // HTML Tutorial PDF (as proxy for WebDev)
        pdfUrl: "https://www.tutorialspoint.com/html/html_tutorial.pdf"
    }
};

function openResourcePreview(type) {
    const data = resourceData[type];
    if (!data) return;

    // Create modal if it doesn't exist
    if (!document.getElementById('resource-modal')) {
        const modalHtml = `
            <div id="resource-modal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
                <div class="modal-content" style="background: white; width: 95%; max-width: 900px; height: 90vh; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; animation: slideIn 0.3s ease; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
                    
                    <!-- Header -->
                    <div style="padding: 15px 25px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #fff;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 35px; height: 35px; background: #f0fdf4; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #16a34a; font-size: 1.1rem;">
                                <i id="res-icon"></i>
                            </div>
                            <h3 id="res-title" style="margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 600;"></h3>
                        </div>
                        <button onclick="closeResourceModal()" style="border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #64748b; padding: 5px; line-height: 1;">&times;</button>
                    </div>

                    <!-- PDF Viewer (Iframe) -->
                    <div style="flex: 1; background: #f1f5f9; position: relative; overflow: hidden;">
                         <iframe id="res-frame" src="" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>

                    <!-- Footer -->
                    <div style="padding: 15px 25px; border-top: 1px solid #e2e8f0; background: #fff; display: flex; justify-content: center; align-items: center;">
                        <a id="res-download-link" href="#" target="_blank" class="btn btn-primary" style="padding: 10px 40px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 1.1rem;">
                            <i class="fas fa-download"></i> Download PDF
                        </a>
                    </div>
                </div>
            </div>
            <style>
                @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Populate Modal
    const modal = document.getElementById('resource-modal');
    document.getElementById('res-title').innerText = data.title;
    document.getElementById('res-icon').className = data.icon;

    // Set PDF URL
    const frame = document.getElementById('res-frame');
    frame.src = data.pdfUrl;

    // Set Download Link
    const downloadLink = document.getElementById('res-download-link');
    downloadLink.href = data.pdfUrl; // Direct link to PDF

    // Show Modal
    modal.style.display = 'flex';
}

function closeResourceModal() {
    const modal = document.getElementById('resource-modal');
    if (modal) {
        modal.style.display = 'none';
        // Clear src to stop playing/loading
        const frame = document.getElementById('res-frame');
        if (frame) frame.src = '';
    }
}

// Force Hamburger Visibility Logic
function forceHamburgerVisibility() {
    const hamburger = document.getElementById('hamburger');
    if (!hamburger) return;

    if (window.innerWidth <= 1024) {
        // Force styles directly via JS to override any CSS issues
        // UPDATED: Place inside navbar, not fixed floating
        hamburger.style.display = 'flex';
        hamburger.style.visibility = 'visible';
        hamburger.style.opacity = '1';
        hamburger.style.position = 'relative'; // In flow
        hamburger.style.bottom = 'auto'; // Reset
        hamburger.style.right = 'auto'; // Reset
        hamburger.style.zIndex = '1000';
        hamburger.style.marginLeft = 'auto'; // Push to right if needed
        console.log('Hamburger forced visible (Navbar Mode) by JS');
    } else {
        hamburger.style.display = 'none';
    }
}

// Run on load and resize
window.addEventListener('load', forceHamburgerVisibility);
window.addEventListener('resize', forceHamburgerVisibility);

// Also run immediately just in case
forceHamburgerVisibility();
