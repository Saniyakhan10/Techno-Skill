// Checkout page specific JavaScript

let currentSubtotal = 0;
let platformFee = 150.00; // Fixed platform fee in INR
let appliedDiscount = 0;
let isCouponApplied = false;
let isCartMode = false;
let checkoutItems = [];

document.addEventListener('DOMContentLoaded', function () {
    // Check mode
    const mode = localStorage.getItem('checkoutMode');
    if (mode === 'cart') {
        isCartMode = true;
    }

    loadCheckoutPage();
    setupPaymentMethods();

    // Autofill user info if logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        if (document.getElementById('card-name')) document.getElementById('card-name').value = currentUser.name;
        if (document.getElementById('email')) document.getElementById('email').value = currentUser.email;
    }
});

function loadCheckoutPage() {
    const selectedCourse = document.getElementById('selected-course');
    const orderSummary = document.getElementById('order-summary');
    const totalAmount = document.getElementById('total-amount');

    if (!selectedCourse || !orderSummary || !totalAmount) return;

    if (isCartMode) {
        // Load from Cart
        checkoutItems = getCartCourses();
        if (checkoutItems.length > 0) {
            currentSubtotal = checkoutItems.reduce((sum, item) => sum + item.price, 0);
            renderCheckoutItems(checkoutItems);
        } else {
            showEmptyState('Your cart is empty');
        }
    } else {
        // Load Single Course
        const selectedCourseId = parseInt(localStorage.getItem('selectedCourse'));
        if (selectedCourseId) {
            const course = getCourseById(selectedCourseId);
            if (course) {
                checkoutItems = [course];
                currentSubtotal = course.price;
                renderCheckoutItems(checkoutItems);
            } else {
                showEmptyState('Course not found');
            }
        } else {
            showEmptyState('No course selected');
        }
    }

    updateOrderSummary();
    applyStyles();
}

function renderCheckoutItems(items) {
    const container = document.getElementById('selected-course');

    // If multiple items, slight layout adjustment
    const itemsHtml = items.map(course => `
        <div class="checkout-course-card">
            <div class="course-img">
                <img src="${course.image}" alt="${course.title}" loading="lazy" data-fallback="course">
            </div>
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.description.substring(0, 100)}...</p>
                <div class="course-details">
                    <div class="detail"><i class="fas fa-clock"></i> <span>${course.duration}</span></div>
                    <div class="detail"><i class="fas fa-signal"></i> <span>${course.level}</span></div>
                    <div class="detail" style="font-weight: 700; color: var(--primary);">₹${course.price.toLocaleString('en-IN')}</div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = itemsHtml;

    // Apply image fallbacks
    setTimeout(() => {
        if (typeof applyImageFallbacks === 'function') {
            applyImageFallbacks();
        }
    }, 100);
}

function applyStyles() {
    if (!document.querySelector('#checkout-styles-v2')) {
        const style = document.createElement('style');
        style.id = 'checkout-styles-v2';
        style.textContent = `
            .checkout-container {
                display: grid;
                grid-template-columns: 1.5fr 1fr;
                gap: 40px;
                align-items: start;
            }

            .checkout-course-card {
                background: #fff;
                padding: 24px;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
                border-left: 5px solid var(--primary);
            }

            .checkout-course-card .course-img {
                width: 140px;
                height: 90px;
                border-radius: 12px;
                overflow: hidden;
                flex-shrink: 0;
            }

            .checkout-course-card .course-img img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .checkout-course-card .course-info h3 {
                font-size: 1.1rem;
                margin-bottom: 5px;
            }

            .checkout-course-card .course-details {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                margin-top: 10px;
            }

            .checkout-course-card .detail {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.85rem;
                color: #64748b;
            }

            .payment-section, .premium-summary {
                background: #fff;
                padding: 24px;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            }
            
            .premium-summary {
                position: sticky;
                top: 100px;
            }

            .coupon-section {
                margin: 20px 0;
                padding: 15px;
                background: #f8fafc;
                border-radius: 12px;
                border: 1px dashed #cbd5e1;
            }

            .coupon-section label {
                display: block;
                font-size: 0.85rem;
                margin-bottom: 8px;
                font-weight: 600;
                color: #1e293b;
            }

            .coupon-input-group {
                display: flex;
                gap: 10px;
            }

            .coupon-input-group input {
                flex: 1;
                padding: 10px 15px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
                font-size: 0.9rem;
                outline: none;
                transition: border-color 0.2s;
            }

            .coupon-input-group input:focus {
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(140, 82, 255, 0.1);
            }

            .coupon-input-group button {
                padding: 10px 20px;
                background: var(--primary);
                color: #fff;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .coupon-input-group button:hover {
                opacity: 0.9;
            }

            #coupon-message {
                font-size: 0.8rem;
                margin-top: 5px;
            }

            .summary-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #f1f5f9;
                color: #475569;
            }

            .summary-item.discount {
                color: #10b981;
                font-weight: 600;
            }

            .summary-total {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 0;
                font-size: 1.4rem;
                font-weight: 800;
                color: var(--primary);
            }
            
            @media (max-width: 1024px) {
                .checkout-container { grid-template-columns: 1fr; }
                .premium-summary { position: static; }
            }
        `;
        document.head.appendChild(style);
    }
}

function showEmptyState(msg) {
    const selectedCourse = document.getElementById('selected-course');
    selectedCourse.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 20px;"></i>
            <h3>${msg}</h3>
            <p>Please browse our courses and pick one to enroll.</p>
            <a href="courses.html" class="btn btn-primary" style="margin-top: 15px;">Browse Courses</a>
        </div>
    `;
    document.querySelector('.payment-section').style.display = 'none';
    document.querySelector('.checkout-right').style.display = 'none';
}

function updateOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const totalAmount = document.getElementById('total-amount');

    const tax = currentSubtotal * 0.18; // 18% GST for India
    const total = currentSubtotal + platformFee + tax - appliedDiscount;

    orderSummary.innerHTML = `
        <div class="summary-item">
            <span>Price (${checkoutItems.length} items):</span>
            <span>₹${currentSubtotal.toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-item">
            <span>Platform Fee:</span>
            <span>₹${platformFee.toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-item">
            <span>GST (18%):</span>
            <span>₹${tax.toLocaleString('en-IN')}</span>
        </div>
        ${appliedDiscount > 0 ? `
            <div class="summary-item discount">
                <span>Discount:</span>
                <span>-₹${appliedDiscount.toLocaleString('en-IN')}</span>
            </div>
        ` : ''}
    `;

    totalAmount.textContent = `₹${total.toLocaleString('en-IN')}`;
    localStorage.setItem('checkoutTotal', total.toFixed(2));
}

function applyCoupon() {
    const code = document.getElementById('coupon-code').value.trim().toUpperCase();
    const msg = document.getElementById('coupon-message');

    if (isCouponApplied) {
        msg.textContent = "Coupon already applied!";
        msg.style.color = "#ef4444";
        return;
    }

    if (code === 'TECH20') {
        const discount = currentSubtotal * 0.20;
        appliedDiscount = discount;
        isCouponApplied = true;

        msg.textContent = "Congrats! 20% discount applied.";
        msg.style.color = "#10b981";

        // Confetti Celebration
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 10001 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 60 * (timeLeft / duration);
            // Side bursts
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0, 0.2), y: Math.random() - 0.2 },
                colors: ['#667eea', '#764ba2', '#FFD700']
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.8, 1), y: Math.random() - 0.2 },
                colors: ['#667eea', '#764ba2', '#FFD700']
            }));
            // Center burst
            if (timeLeft > duration * 0.8) {
                confetti(Object.assign({}, defaults, {
                    particleCount: 100,
                    origin: { x: 0.5, y: 0.5 },
                    scalar: 2,
                    shapes: ['circle', 'square']
                }));
            }
        }, 300);

        updateOrderSummary();
        showNotification('🎉 SPECTACULAR! TECH20 coupon applied. Savings unlocked!', 'success');
    } else if (code === '') {
        msg.textContent = "Please enter a code.";
        msg.style.color = "#ef4444";
    } else {
        msg.textContent = "Invalid coupon code.";
        msg.style.color = "#ef4444";
    }
}

function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function () {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function processPayment() {
    if (checkoutItems.length === 0) {
        showNotification('No items to purchase', 'warning');
        return;
    }

    // Validate form
    const cardName = document.getElementById('card-name');
    const cardNumber = document.getElementById('card-number');
    const expiry = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');
    const email = document.getElementById('email');
    const terms = document.getElementById('terms');

    if (!cardName || !cardNumber || !expiry || !cvv || !email || !terms) {
        alert('Form elements not found. Please refresh the page.');
        return;
    }

    if (!cardName.value.trim() || !cardNumber.value.trim() || !expiry.value.trim() || !cvv.value.trim() || !email.value.trim()) {
        showNotification('All fields are required', 'error');
        return;
    }

    if (!terms.checked) {
        showNotification('Please agree to the terms', 'error');
        return;
    }

    const purchaseBtn = document.querySelector('.btn-primary.btn-block');
    if (!purchaseBtn) {
        alert('Purchase button not found. Please refresh the page.');
        return;
    }

    const originalText = purchaseBtn.innerHTML;
    purchaseBtn.disabled = true;
    purchaseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Process payment
    setTimeout(function () {
        // Add purchased courses
        for (var i = 0; i < checkoutItems.length; i++) {
            addPurchasedCourse(checkoutItems[i].id);
        }

        // Clear Cart if in cart mode
        if (isCartMode) {
            clearCart();
            localStorage.removeItem('checkoutMode');
        } else {
            localStorage.removeItem('selectedCourse');
        }

        // Show success message
        const successMsg = document.getElementById('success-message');
        const checkoutContainer = document.querySelector('.checkout-container');

        if (successMsg) {
            successMsg.style.display = 'block';
        }
        if (checkoutContainer) {
            checkoutContainer.style.display = 'none';
        }
        if (successMsg) {
            successMsg.scrollIntoView({ behavior: 'smooth' });
        }

        // Reset form
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.reset();
        }

        // Clear data
        localStorage.removeItem('checkoutTotal');

        // Update counts
        updateWishlistCount();
        updateCompareCount();
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }

        showNotification('Payment successful!', 'success');

        purchaseBtn.disabled = false;
        purchaseBtn.innerHTML = originalText;
    }, 10);
}