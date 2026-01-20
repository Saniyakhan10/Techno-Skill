// Wishlist page specific JavaScript

document.addEventListener('DOMContentLoaded', function () {
    loadWishlistCourses();
    setupModalListeners();
});

function loadWishlistCourses() {
    const container = document.getElementById('wishlist-container');
    const wishlistCourses = getWishlistCourses();

    if (wishlistCourses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="far fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Add courses to your wishlist to save them for later</p>
                <a href="courses.html" class="btn btn-primary">Browse Courses</a>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="wishlist-header">
                <h2>My Wishlist <span class="badge">${wishlistCourses.length} courses</span></h2>
                <p>Courses you've saved for later purchase</p>
            </div>
            <div class="courses-grid" id="wishlist-grid">
                ${wishlistCourses.map(course => createCourseCard(course)).join('')}
            </div>
            <div class="wishlist-actions" style="margin-top: 40px; display: flex; gap: 20px; justify-content: center;">
                <button class="btn btn-outline" onclick="clearWishlist()">
                    <i class="fas fa-trash"></i> Clear All
                </button>
                <a href="courses.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Add More Courses
                </a>
            </div>
        `;

        // Apply image fallbacks
        setTimeout(() => {
            applyImageFallbacks();
            bindCoursePreviewClicks();
        }, 100);
    }
}

function bindCoursePreviewClicks() {
    const cards = document.querySelectorAll('.course-card-premium');
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function (e) {
            // Don't trigger if a button inside the card was clicked
            if (e.target.closest('button') || e.target.closest('.action-buttons')) {
                return;
            }

            const courseId = parseInt(this.dataset.id);
            showCoursePreview(courseId);
        });
    });
}

function showCoursePreview(courseId) {
    const course = getCourseById(courseId);
    if (!course) return;

    const modal = document.getElementById('course-preview-modal');
    const content = document.getElementById('preview-content');

    // Default subjects if none provided
    const subjects = course.subjects || [
        { name: "Introduction to " + course.category, ytLink: "https://www.youtube.com/results?search_query=" + encodeURIComponent(course.category + " tutorial") },
        { name: "Basics & Fundamentals", ytLink: "https://www.youtube.com/results?search_query=" + encodeURIComponent(course.title + " basics") },
        { name: "Advanced Concepts", ytLink: "https://www.youtube.com/results?search_query=" + encodeURIComponent(course.title + " advanced") }
    ];

    content.innerHTML = `
        <div class="preview-header">
            <img src="${course.image}" alt="${course.title}" class="preview-img" data-fallback="course">
            <div class="preview-header-info">
                <h2>${course.title}</h2>
                <div class="preview-meta">
                    <span><i class="fas fa-signal"></i> ${course.level}</span>
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-star"></i> ${course.rating.toFixed(1)}</span>
                </div>
            </div>
        </div>
        <div class="preview-body">
            <h3>Description</h3>
            <p>${course.description}</p>
            
            <div class="subjects-section">
                <h3>Available Subjects & Videos</h3>
                <div class="subject-list">
                    ${subjects.map(sub => `
                        <a href="${sub.ytLink}" target="_blank" class="subject-item">
                            <div class="subject-info">
                                <i class="fab fa-youtube"></i>
                                <span>${sub.name}</span>
                            </div>
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
            
            <div class="preview-footer">
                <div class="preview-price">₹${course.price.toLocaleString('en-IN')}</div>
                <button class="btn btn-primary" onclick="buyCourse(${course.id})">Enroll Now</button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function setupModalListeners() {
    const modal = document.getElementById('course-preview-modal');
    const closeBtn = document.getElementById('close-preview-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

function clearWishlist() {
    const wishlist = getWishlist();
    if (wishlist.length === 0) {
        showNotification('Wishlist is already empty', 'info');
        return;
    }

    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        localStorage.setItem('wishlist', JSON.stringify([]));
        updateWishlistCount();
        showNotification('Wishlist cleared', 'success');
        loadWishlistCourses();
    }
}