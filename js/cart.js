document.addEventListener('DOMContentLoaded', function () {
    loadCartCourses();
});

function loadCartCourses() {
    const container = document.getElementById('cart-container');
    const cartCourses = getCartCourses();

    if (cartCourses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any courses yet.</p>
                <a href="courses.html" class="btn btn-primary">Browse Courses</a>
            </div>
        `;
        updateCartSummary(0);
    } else {
        container.innerHTML = `
            <div class="cart-layout" style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
                <div class="cart-items">
                    ${cartCourses.map(course => createCartItem(course)).join('')}
                </div>
                <div class="cart-summary-wrapper">
                    <div class="cart-summary" style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); position: sticky; top: 100px;">
                        <h3 style="margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px;">Order Summary</h3>
                        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #64748b;">
                            <span>Subtotal (${cartCourses.length} items)</span>
                            <span>₹${cartCourses.reduce((sum, c) => sum + c.price, 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #64748b;">
                            <span>Platform Fee</span>
                            <span>₹150</span>
                        </div>
                        <div class="summary-total" style="display: flex; justify-content: space-between; margin-top: 20px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 1.2rem; font-weight: 700; color: var(--dark);">
                            <span>Total</span>
                            <span id="cart-total">₹${(cartCourses.reduce((sum, c) => sum + c.price, 0) + 150).toLocaleString('en-IN')}</span>
                        </div>
                        <button class="btn btn-primary btn-block" style="width: 100%; margin-top: 25px;" onclick="checkoutCart()">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

function createCartItem(course) {
    return `
        <div class="cart-item" style="display: flex; gap: 20px; background: white; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; margin-bottom: 20px;">
            <div class="cart-item-img" style="width: 150px; height: 100px; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
                <img src="${course.image}" alt="${course.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="cart-item-info" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 5px;">${course.title}</h3>
                    <button onclick="removeFromCartList(${course.id})" style="background: none; border: none; color: #ef4444; cursor: pointer;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 10px;">By ${course.instructor}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <div style="font-weight: 700; color: var(--primary); font-size: 1.1rem;">₹${course.price.toLocaleString('en-IN')}</div>
                    <button onclick="moveToWishlist(${course.id})" style="font-size: 0.85rem; color: var(--primary); background: none; border: none; cursor: pointer; text-decoration: underline;">
                        Move to Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
}

function removeFromCartList(courseId) {
    removeFromCart(courseId);
    loadCartCourses();
    showNotification('Removed from cart', 'info');
}

function moveToWishlist(courseId) {
    removeFromCart(courseId);
    addToWishlist(courseId);
    loadCartCourses();
    showNotification('Moved to wishlist', 'success');
}

function checkoutCart() {
    const cartCourses = getCartCourses();
    if (cartCourses.length === 0) return;

    // Check login
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Please login to checkout.');
        localStorage.setItem('redirectAfterLogin', 'cart.html');
        window.location.href = 'login.html';
        return;
    }

    // Pass cart data to checkout via localStorage
    // We'll use a special flag or just use the existing logic adapted
    // Since checkout.js expects "selectedCourse", we might need to modify checkout.js
    // OR we modify checkout.js to look for 'checkoutMode' = 'cart'

    localStorage.setItem('checkoutMode', 'cart');
    window.location.href = 'checkout.html';
}

function updateCartSummary(total) {
    // implemented inside loadCartCourses
}
