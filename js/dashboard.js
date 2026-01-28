// Dashboard page specific JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const user = requireAuth();
    if (!user) return; // redirect handled in requireAuth

    // Set user info
    document.getElementById('welcome-msg').textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    document.getElementById('user-avatar-display').innerHTML = `<img src="${user.avatar}" class="nav-user-avatar" alt="User" style="width: 100%; height: 100%; object-fit: cover;">`;

    if (user.role === 'admin') {
        const badge = document.getElementById('role-badge');
        badge.textContent = 'Admin Account';
        badge.classList.add('badge-admin');

        // Switch Views
        document.getElementById('student-dashboard').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';

        loadAdminDashboard();
    } else {
        const badge = document.getElementById('role-badge');
        badge.textContent = 'Student Account';
        badge.classList.add('badge-student');
        loadDashboard(); // Load student dashboard
        loadRecommendedCourses();
    }
});

// STUDENT DASHBOARD LOGIC (Existing)
function loadDashboard() {
    const purchasedContainer = document.getElementById('purchased-courses');
    const purchasedCourses = getPurchasedCoursesWithDetails();

    // Update stats
    updateDashboardStats(purchasedCourses);

    if (purchasedCourses.length === 0) {
        purchasedContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No courses purchased yet</h3>
                <p>Purchase courses to start learning and tracking your progress.</p>
                <a href="courses.html" class="btn btn-primary">Browse Premium Courses</a>
            </div>
        `;
    } else {
        purchasedContainer.innerHTML = `
            <div class="learning-progress-grid">
                ${purchasedCourses.map(course => `
                    <div class="course-progress-card" data-id="${course.id}">
                        <div class="progress-card-content">
                            <div class="progress-course-info">
                                <h4>${course.title}</h4>
                                <div class="course-meta-simple">
                                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                                    <span><i class="fas fa-graduation-cap"></i> ${course.level}</span>
                                </div>
                            </div>
                            
                            <div class="progress-stat-wrapper">
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
                                </div>
                                <span class="progress-label">${course.progress}% Complete</span>
                            </div>

                            <div class="progress-dashboard-details">
                                <div class="p-detail">
                                    <i class="fas fa-play-circle"></i>
                                    <span>${course.lectures} Lectures</span>
                                </div>
                                <div class="p-detail">
                                    <i class="fas fa-certificate"></i>
                                    <span>${course.certificate ? 'Certificate Included' : 'No Certificate'}</span>
                                </div>
                            </div>

                            <div class="progress-card-actions">
                                <button class="btn btn-primary btn-sm" onclick="continueLearning(${course.id})">
                                    <i class="fas fa-play"></i> Continue
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="updateProgress(${course.id})">
                                    <i class="fas fa-sync-alt"></i> Update
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="viewCertificate(${course.id})" ${course.progress < 100 || !course.certificate ? 'disabled title="Complete 100% to unlock"' : ''}>
                                    <i class="fas fa-award"></i> Certificate
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function updateDashboardStats(courses) {
    const totalCourses = courses.length;
    const completedCount = courses.filter(course => course.progress >= 100).length;
    const inProgressCount = courses.filter(course => course.progress > 0 && course.progress < 100).length;
    const certificatesCount = courses.filter(course => course.certificate && course.progress >= 100).length;
    const studyHours = courses.reduce((total, course) => {
        const hours = parseInt(course.duration.split(' ')[0]) || 0;
        return total + (hours * (course.progress / 100));
    }, 0);
    const achievements = completedCount * 2 + Math.floor(studyHours / 10);

    document.getElementById('courses-count').textContent = totalCourses.toLocaleString('en-IN');
    document.getElementById('completed-count').textContent = completedCount.toLocaleString('en-IN');
    document.getElementById('inprogress-count').textContent = inProgressCount.toLocaleString('en-IN');
    document.getElementById('certificates-count').textContent = certificatesCount.toLocaleString('en-IN');
    document.getElementById('study-hours').textContent = Math.round(studyHours).toLocaleString('en-IN');
    document.getElementById('achievements').textContent = achievements.toLocaleString('en-IN');
}

function loadRecommendedCourses() {
    const container = document.getElementById('recommended-courses');
    if (container) {
        // Get courses not already purchased
        const purchased = getPurchasedCourses();
        const purchasedIds = purchased.map(item => item.id);
        const recommended = getAllCourses()
            .filter(course => !purchasedIds.includes(course.id))
            .slice(0, 3);

        if (recommended.length > 0) {
            container.innerHTML = recommended.map(course =>
                createCourseCard(course, { showBuyBtn: true, showCompareBtn: true, showWishlistBtn: true })
            ).join('');

            // Bind preview clicks
            bindCoursePreviewClicks();
        } else {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-star"></i>
                    <h3>No recommendations available</h3>
                    <p>You've already enrolled in all our top courses!</p>
                </div>
            `;
        }
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
            <img src="${course.image}" alt="${course.title}" class="preview-img">
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
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function showMentorProfile(mentorName) {
    const mentor = getMentorByName(mentorName);
    if (!mentor) return;

    const modal = document.getElementById('mentor-profile-modal');
    const content = document.getElementById('mentor-content');

    content.innerHTML = `
        <div class="mentor-header">
            <div class="mentor-img-wrapper">
                <img src="${mentor.image}" alt="${mentor.name}" class="mentor-profile-img">
            </div>
            <div class="mentor-header-info">
                <h2>${mentor.name}</h2>
                <span class="mentor-role">${mentor.role}</span>
                <div class="mentor-experience">
                    <i class="fas fa-award"></i>
                    <span>${mentor.experience} Experience</span>
                </div>
            </div>
        </div>
        <div class="mentor-body">
            <h3>About the Mentor</h3>
            <p>${mentor.bio}</p>
            
            <div class="mentor-skills-section">
                <h4>Specializations</h4>
                <div class="skills-list">
                    ${mentor.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        </div>
        <div class="mentor-footer">
            <button class="btn btn-primary" onclick="document.getElementById('mentor-profile-modal').style.display='none'; document.body.style.overflow='auto';">Close Profile</button>
            <div class="mentor-social">
                <a href="#"><i class="fab fa-linkedin"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Modal closing logic
document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.getElementById('close-preview-modal');
    const closeMentorBtn = document.getElementById('close-mentor-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            document.getElementById('course-preview-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (closeMentorBtn) {
        closeMentorBtn.addEventListener('click', function () {
            document.getElementById('mentor-profile-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', function (e) {
        const modal = document.getElementById('course-preview-modal');
        const mentorModal = document.getElementById('mentor-profile-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === mentorModal) {
            mentorModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});


function updateProgress(courseId) {
    const currentProgress = getPurchasedCourses().find(item => item.id === courseId)?.progress || 0;
    const progress = prompt(`Enter progress percentage (0-100):\nCurrent: ${currentProgress}%`, currentProgress);

    if (progress !== null) {
        const progressNum = parseInt(progress);
        if (!isNaN(progressNum) && progressNum >= 0 && progressNum <= 100) {
            updateCourseProgress(courseId, progressNum);
            loadDashboard(); // Refresh dashboard
            showNotification('Progress updated successfully!', 'success');
        } else {
            showNotification('Please enter a valid number between 0 and 100', 'warning');
        }
    }
}

// Player State
let playerState = {
    course: null,
    currentModuleIndex: 0
};

function continueLearning(courseId) {
    const course = getCourseById(courseId);
    if (!course) return;

    playerState.course = course;
    playerState.currentModuleIndex = 0;

    // Check if course has modules, if not create dummy ones for demo
    if (!course.modules || course.modules.length === 0) {
        course.modules = [
            { title: "Module 1: Introduction", duration: "10:00", videoUrl: "https://www.youtube.com/embed/EngW7tLk6R8" },
            { title: "Module 2: Getting Started", duration: "15:00", videoUrl: "https://www.youtube.com/embed/zJSY8tbf_ys" },
            { title: "Module 3: Core Concepts", duration: "20:00", videoUrl: "https://www.youtube.com/embed/kUMe1FH4CHE" }
        ];
    }

    openPlayerModal();
}

function openPlayerModal() {
    const modal = document.getElementById('course-player-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    document.getElementById('player-course-title').textContent = playerState.course.title;

    renderPlayerModules();
    loadModule(0);
}

function closePlayerModal() {
    const modal = document.getElementById('course-player-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Stop video
    document.getElementById('player-video-frame').src = '';
}

function renderPlayerModules() {
    const list = document.getElementById('player-modules-list');
    list.innerHTML = playerState.course.modules.map((mod, index) => `
        <div class="module-item ${index === playerState.currentModuleIndex ? 'active' : ''}" 
             onclick="loadModule(${index})">
            <div class="module-main">
                <span class="module-title">${mod.title}</span>
                <span class="module-duration"><i class="fas fa-clock"></i> ${mod.duration}</span>
            </div>
            ${index === playerState.currentModuleIndex ? '<i class="fas fa-play-circle"></i>' : '<i class="far fa-circle-play"></i>'}
        </div>
    `).join('');
}

function loadModule(index) {
    if (index < 0 || index >= playerState.course.modules.length) return;

    playerState.currentModuleIndex = index;
    const module = playerState.course.modules[index];

    // Update Video
    document.getElementById('player-video-frame').src = module.videoUrl;
    document.getElementById('player-video-title').textContent = module.title;

    // Update active state in list
    renderPlayerModules();

    // Update Buttons
    const prevBtn = document.getElementById('prev-module-btn');
    const nextBtn = document.getElementById('next-module-btn');

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === playerState.course.modules.length - 1;

    // Direct assignment to avoid event listener buildup
    prevBtn.onclick = () => loadModule(index - 1);
    nextBtn.onclick = () => loadModule(index + 1);

    // Save progress update (simulate)
    const newProgress = Math.min(100, Math.round(((index + 1) / playerState.course.modules.length) * 100));
    // updateCourseProgress(playerState.course.id, newProgress); // Optional: auto update progress
}

function viewCertificate(courseId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser ? currentUser.name : 'Student Name';

    const course = getCourseById(courseId);
    const progress = getPurchasedCourses().find(item => item.id === courseId)?.progress || 0;

    if (!course.certificate) {
        showNotification('This course does not offer a certificate', 'warning');
        return;
    }

    if (progress < 100) {
        showNotification('Complete the course (100%) to earn your certificate', 'warning');
        return;
    }

    // Simulate certificate generation
    const certificateWindow = window.open('', '_blank');
    certificateWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate of Completion - ${course.title}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 50px;
                    background: #f5f7ff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .certificate {
                    background: white;
                    padding: 50px;
                    border: 20px solid var(--primary);
                    border-image: linear-gradient(45deg, #8c52ff, #6a3fd8) 1;
                    text-align: center;
                    max-width: 800px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    position: relative;
                }
                .header h1 { color: #8c52ff; font-size: 2.5rem; margin-bottom: 10px; }
                .header p { color: #666; font-size: 1.2rem; }
                .content { margin: 40px 0; }
                .content h2 { font-size: 3rem; margin-bottom: 20px; color: #333; }
                .content h3 { font-size: 1.5rem; color: #8c52ff; margin-bottom: 30px; }
                .student-name { font-size: 2.5rem; color: #333; margin: 30px 0; padding: 20px; background: #f5f7ff; border-radius: 10px; }
                .details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 40px 0; }
                .detail-item h4 { color: #666; margin-bottom: 10px; }
                .detail-item p { font-size: 1.2rem; font-weight: 600; color: #333; }
                .footer { margin-top: 40px; border-top: 2px solid #eee; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; }
                .signature h4, .date h4 { margin-bottom: 5px; color: #333; }
                .logo { font-size: 2rem; font-weight: 700; color: #8c52ff; margin-bottom: 20px; }
                .logo span { color: #6a3fd8; }
                .cert-id { position: absolute; bottom: 20px; right: 20px; font-size: 0.8rem; color: #999; }
                .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; color: rgba(140, 82, 255, 0.1); font-weight: bold; pointer-events: none; user-select: none; }
            </style>
        </head>
        <body>
            <div class="certificate">
                <div class="watermark">TECHNO SKILL</div>
                <div class="logo">Techno<span>Skill</span></div>
                <div class="header">
                    <h1>CERTIFICATE OF COMPLETION</h1>
                    <p>This certificate is proudly presented to</p>
                </div>
                <div class="content">
                    <div class="student-name">${userName}</div>
                    <h3>For successfully completing the course</h3>
                    <h2>${course.title}</h2>
                </div>
                <div class="details">
                    <div class="detail-item"><h4>Duration</h4><p>${course.duration}</p></div>
                    <div class="detail-item"><h4>Level</h4><p>${course.level}</p></div>
                    <div class="detail-item"><h4>Completion Date</h4><p>${new Date().toLocaleDateString()}</p></div>
                </div>
                <div class="footer">
                    <div class="signature"><h4>${course.instructor}</h4><p>Course Instructor</p></div>
                    <div class="date"><h4>Date of Issue</h4><p>${new Date().toLocaleDateString()}</p></div>
                </div>
                <div class="cert-id">Certificate ID: CERT-${course.id}-${Date.now().toString(36).toUpperCase()}</div>
            </div>
        </body>
        </html>
    `);
    certificateWindow.document.close();

    showNotification('Certificate generated successfully!', 'success');
}

// Helper function to format date
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ADMIN DASHBOARD LOGIC
function loadAdminDashboard() {
    const allEnrollments = getAllEnrollments();
    const allCourses = getAllCourses();

    // Stats Logic
    const totalStudents = new Set(allEnrollments.map(e => e.userId)).size;
    const totalRevenue = allEnrollments.reduce((sum, e) => sum + (parseInt(e.price) || 0), 0);
    const activeCourses = allCourses.length;

    document.getElementById('admin-revenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
    document.getElementById('admin-students').textContent = totalStudents.toLocaleString('en-IN');
    document.getElementById('admin-courses').textContent = activeCourses.toLocaleString('en-IN');

    // Enrollments List
    const enrollmentList = document.getElementById('enrollment-list');
    const recentEnrollments = [...allEnrollments].reverse().slice(0, 10);

    if (recentEnrollments.length > 0) {
        enrollmentList.innerHTML = recentEnrollments.map(enr => `
            <tr>
                <td>
                    <div class="student-name-cell">${enr.studentName}</div>
                    <div class="student-id-cell">${enr.userId}</div>
                </td>
                <td>
                    <div style="font-weight: 500;">${enr.courseTitle}</div>
                    <div style="font-size: 0.8rem; color: #64748b;">ID: ${enr.id}</div>
                </td>
                <td style="white-space: nowrap;">
                     <div style="font-weight: 500; color: #334155;">${formatDate(enr.date)}</div>
                     <div style="font-size: 0.75rem; color: #94a3b8;">${enr.timestamp ? new Date(enr.timestamp).toLocaleTimeString() : ''}</div>
                </td>
                <td class="amount-cell">₹${(parseInt(enr.price) || 0).toLocaleString('en-IN')}</td>
                <td style="text-align: center;">
                    <button class="btn-icon-delete" onclick="handleDeleteEnrollment('${enr.id}')" title="Delete Entry" style="background:none; border:none; color: #ef4444; cursor:pointer; padding: 5px; font-size: 1rem;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } else {
        enrollmentList.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No enrollments found yet.</td></tr>';
    }

    // Inquiries List
    const inquiriesList = document.getElementById('inquiries-list');
    const inquiries = getContactInquiries();

    if (inquiries.length > 0) {
        inquiriesList.innerHTML = inquiries.map(inq => `
            <tr id="row-${inq.id}">
                <td>
                    <strong>${inq.name}</strong><br>
                    <small style="color: #6366f1;">${inq.email}</small>
                </td>
                <td style="max-width: 400px;">
                    <div style="font-weight: 700; color: #1e293b; margin-bottom: 5px;">${inq.subject}</div>
                    <div style="font-size: 0.9rem; color: #475569; line-height: 1.5; background: #f1f5f9; padding: 10px; border-radius: 8px; border-left: 3px solid #8c52ff;">
                        ${inq.message}
                    </div>
                </td>
                <td>
                    <div style="font-size: 0.9rem; font-weight: 500;">${inq.date}</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">${inq.time}</div>
                </td>
                <td class="text-right">
                    <button class="btn-icon-delete" onclick="handleDeleteInquiry('${inq.id}')" style="background:#fee2e2; border:none; color: #ef4444; cursor:pointer; padding: 8px; border-radius: 6px; font-size: 0.9rem;" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } else {
        inquiriesList.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #64748b;">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    No inquiries yet
                </td>
            </tr>
        `;
    }
}

function handleDeleteInquiry(id) {
    if (confirm('Delete this inquiry?')) {
        if (deleteInquiry(id)) {
            loadAdminDashboard();
            showNotification('Inquiry deleted', 'success');
        }
    }
}

function handleDeleteEnrollment(enrollmentId) {
    if (confirm('Are you sure you want to delete this enrollment record? This cannot be undone.')) {
        if (typeof deleteEnrollment === 'function' && deleteEnrollment(enrollmentId)) {
            showNotification('Enrollment record deleted successfully', 'success');
            loadAdminDashboard();
        } else {
            showNotification('Failed to delete record', 'error');
        }
    }
}

function showCreateCourseModal() {
    document.getElementById('create-course-modal').style.display = 'flex';
}

function closeCreateCourseModal() {
    document.getElementById('create-course-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('create-course-modal');
    if (event.target == modal) {
        closeCreateCourseModal();
    }
}

function handleCreateCourse(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const courseData = {
        title: formData.get('title'),
        price: formData.get('price'),
        category: formData.get('category'),
        duration: formData.get('duration'),
        level: formData.get('level'),
        description: formData.get('description'),
        instructor: "Admin Instructor", // Default
        instructorBio: "Lead Instructor at Techno Skill"
    };

    if (typeof saveCustomCourse === 'function') {
        saveCustomCourse(courseData);
        showNotification('Course created successfully!', 'success');
        closeCreateCourseModal();
        loadAdminDashboard(); // Refresh
        event.target.reset();
    } else {
        showNotification('Error creating course. Check console.', 'error');
    }
}

// TEST CENTER LOGIC
let currentTest = null;
let userAnswers = [];

function startTest(category) {
    const questions = quizzes[category];
    if (!questions || questions.length === 0) {
        showNotification('No test available for this category yet.', 'info');
        return;
    }

    currentTest = {
        category: category,
        questions: questions,
        currentIndex: 0
    };
    userAnswers = new Array(questions.length).fill(null);

    renderQuestion();
    document.getElementById('test-center-section').scrollIntoView({ behavior: 'smooth' });
}

function renderQuestion() {
    const testView = document.getElementById('test-view');
    const question = currentTest.questions[currentTest.currentIndex];

    testView.innerHTML = `
        <div class="test-active-container">
            <div class="test-progress-header" style="margin-bottom: 20px; color: #64748b; font-weight: 600;">
                Question ${currentTest.currentIndex + 1} of ${currentTest.questions.length}
            </div>
            <div class="question-card">
                <h3>${question.question}</h3>
                <div class="options-list">
                    ${question.options.map((opt, i) => `
                        <div class="option-item ${userAnswers[currentTest.currentIndex] === i ? 'selected' : ''}" 
                             onclick="selectOption(${i})">
                            ${opt}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="test-actions" style="margin-top: 30px; display: flex; justify-content: space-between;">
                <button class="btn btn-secondary" onclick="prevQuestion()" ${currentTest.currentIndex === 0 ? 'disabled' : ''}>Previous</button>
                ${currentTest.currentIndex === currentTest.questions.length - 1
            ? `<button class="btn btn-primary" onclick="submitTest()">Submit Test</button>`
            : `<button class="btn btn-primary" onclick="nextQuestion()">Next Question</button>`
        }
            </div>
        </div>
    `;
}

function selectOption(index) {
    userAnswers[currentTest.currentIndex] = index;
    renderQuestion();
}

function nextQuestion() {
    if (userAnswers[currentTest.currentIndex] === null) {
        showNotification('Please select an answer first.', 'warning');
        return;
    }
    if (currentTest.currentIndex < currentTest.questions.length - 1) {
        currentTest.currentIndex++;
        renderQuestion();
    }
}

function prevQuestion() {
    if (currentTest.currentIndex > 0) {
        currentTest.currentIndex--;
        renderQuestion();
    }
}

function submitTest() {
    if (userAnswers[currentTest.currentIndex] === null) {
        showNotification('Please select an answer first.', 'warning');
        return;
    }

    let score = 0;
    currentTest.questions.forEach((q, i) => {
        if (userAnswers[i] === q.answer) {
            score++;
        }
    });

    showTestResults(score);
}

function showTestResults(score) {
    const testView = document.getElementById('test-view');
    const total = currentTest.questions.length;
    const percentage = (score / total) * 100;
    const isPass = percentage >= 50;

    testView.innerHTML = `
        <div class="test-active-container">
            <div class="test-results">
                <h2 style="${isPass ? 'color: #10b981;' : ''}">${isPass ? 'Congrats! You Passed!' : 'Test Completed!'}</h2>
                <div class="score-circle">
                    <span class="score-num">${score}/${total}</span>
                    <span style="font-size: 0.8rem;">Score</span>
                </div>
                <h3>You scored ${percentage.toFixed(0)}%</h3>
                
                <div class="ans-review">
                    <h4>Review Answers:</h4>
                    ${currentTest.questions.map((q, i) => {
        const isCorrect = userAnswers[i] === q.answer;
        return `
                            <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                                <p><strong>Q${i + 1}:</strong> ${q.question}</p>
                                <p>Your answer: <span class="user-ans ${isCorrect ? '' : 'wrong'}">${q.options[userAnswers[i]]}</span></p>
                                ${!isCorrect ? `<p>Correct answer: <span class="correct-ans">${q.options[q.answer]}</span></p>` : ''}
                            </div>
                        `;
    }).join('')}
                </div>

                <div style="margin-top: 30px;">
                    <button class="btn btn-primary" onclick="resetTestView()">Back to Test Center</button>
                </div>
            </div>
        </div>
    `;

    // Award achievement points if score is high
    if (percentage >= 80) {
        showNotification('Excellent! You earned 50 achievement points!', 'success');
        const achElem = document.getElementById('achievements');
        if (achElem) {
            const currentPoints = parseInt(achElem.textContent) || 0;
            achElem.textContent = (currentPoints + 50).toLocaleString();
        }
    }

    // Celebration Animation if Passed
    if (isPass) {
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
    }
}

function resetTestView() {
    const testView = document.getElementById('test-view');
    testView.innerHTML = `
        <div class="test-selection-grid">
            <div class="test-category-card" onclick="startTest('web')">
                <i class="fas fa-code"></i>
                <h3>Web Development</h3>
                <button class="btn btn-outline">Take Test</button>
            </div>
            <div class="test-category-card" onclick="startTest('data')">
                <i class="fas fa-brain"></i>
                <h3>Data Science</h3>
                <button class="btn btn-outline">Take Test</button>
            </div>
            <div class="test-category-card" onclick="startTest('marketing')">
                <i class="fas fa-bullhorn"></i>
                <h3>Digital Marketing</h3>
                <button class="btn btn-outline">Take Test</button>
            </div>
            <div class="test-category-card" onclick="startTest('design')">
                <i class="fas fa-pen-ruler"></i>
                <h3>UI/UX Design</h3>
                <button class="btn btn-outline">Take Test</button>
            </div>
        </div>
    `;
}

// Dummy Certificate Functions (New)
function downloadDummyCertificate() {
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;

    // 1. Show Loading State
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    btn.disabled = true;

    // 2. Prepare Data
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Student Name' };
    const userName = currentUser.name;
    const courseTitle = "Certified Web Developer";
    const courseDuration = "45 Hours";
    const courseLevel = "Advanced";
    const completionDate = "Jan 15, 2024";

    // 3. Create Temporary Element for PDF Generation
    // Must be appended to body for html2pdf to render it correctly
    const wrapper = document.createElement('div');
    wrapper.id = 'pdf-gen-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px'; // Move off-screen
    wrapper.style.top = '0';
    wrapper.style.width = '1120px';
    wrapper.style.zIndex = '-1';

    // Inject Styles & Content (Matched to View Certificate but optimized for print)
    // Removed external texture to avoid CORS/Network issues
    wrapper.innerHTML = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Montserrat:wght@300;400;600&display=swap');
            
            .pdf-cert-wrapper {
                font-family: 'Montserrat', sans-serif;
                position: relative;
                color: #333;
            }

            .certificate {
                background: white;
                width: 100%;
                padding: 40px;
                position: relative;
                border: 15px solid #fff;
                outline: 5px solid #8c52ff;
                background: #fff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                box-sizing: border-box;
            }
            
            /* Corners */
            .corner { position: absolute; width: 100px; height: 100px; border: 3px solid #8c52ff; z-index: 10; }
            .top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
            .top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
            .bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
            .bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }
            
            /* Seal */
            .seal {
                position: absolute; bottom: 50px; right: 50px; width: 130px; height: 130px;
                background: #ffd700; border-radius: 50%; border: 4px dashed #b8860b;
                display: flex; align-items: center; justify-content: center;
                z-index: 20; color: white;
            }
            .seal-inner {
                text-align: center; color: #fff; font-weight: bold; text-transform: uppercase;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                width: 80%; height: 80%; border: 2px solid white; border-radius: 50%;
            }

            .header-logo {
                font-family: 'Cinzel', serif; font-size: 2rem; color: #333; font-weight: 700;
                margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 10px;
            }
            
            .cert-title {
                font-family: 'Cinzel', serif; font-size: 3rem; color: #8c52ff; margin: 0;
                letter-spacing: 4px; text-transform: uppercase; border-bottom: 3px double #e5e7eb;
                padding-bottom: 10px; display: inline-block; width: 85%;
            }
            
            .student-name {
                font-family: 'Great Vibes', cursive; font-size: 4.5rem; color: #1a1a2e; margin: 20px 0;
                padding: 0 20px;
            }
            
            .course-name {
                font-family: 'Montserrat', sans-serif; font-size: 2rem; font-weight: 700; color: #333;
                margin: 10px 0 30px 0; text-transform: uppercase; letter-spacing: 1px;
            }

            .details-grid {
                display: flex; justify-content: center; gap: 40px; margin: 30px 0; width: 100%;
            }
            .detail-box {
                text-align: center; background: #f8f9fe; padding: 10px 20px; border-radius: 8px;
                border-bottom: 3px solid #8c52ff; min-width: 140px;
            }
            .detail-label { font-size: 0.8rem; color: #888; text-transform: uppercase; margin-bottom: 5px; }
            .detail-value { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }

            .footer {
                width: 85%; display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;
            }
            .signature-img {
                font-family: 'Great Vibes', cursive; font-size: 2.2rem; color: #1a1a2e;
                border-bottom: 2px solid #ccc; padding: 0 30px 5px 30px; margin-bottom: 5px;
            }
            .signature-title { font-size: 0.8rem; color: #666; text-transform: uppercase; font-weight: 600; }
        </style>
        
        <div class="pdf-cert-wrapper">
            <div class="certificate">
                <!-- Corners -->
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                
                <!-- Seal -->
                <div class="seal">
                    <div class="seal-inner">
                        <i class="fas fa-medal" style="font-size: 2rem; margin-bottom: 2px;"></i>
                        <span style="font-size: 0.7rem;">Verified<br>Excellence</span>
                    </div>
                </div>

                <!-- Content -->
                <div class="header-logo">
                    <i class="fas fa-graduation-cap" style="color: #8c52ff; font-size: 2rem;"></i>
                    Techno<span style="color: #8c52ff;">Skill</span>
                </div>

                <h1 class="cert-title">Certificate of Completion</h1>
                <p style="text-transform: uppercase; letter-spacing: 2px; margin-top: 20px; color: #666;">This is to certify that</p>
                
                <div class="student-name">${userName}</div>
                
                <p style="font-size: 1.1rem; color: #555;">has successfully completed the comprehensive training course</p>
                
                <div class="course-name">${courseTitle}</div>

                <div class="details-grid">
                    <div class="detail-box">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">${courseDuration}</div>
                    </div>
                    <div class="detail-box">
                        <div class="detail-label">Competency</div>
                        <div class="detail-value">${courseLevel}</div>
                    </div>
                    <div class="detail-box">
                        <div class="detail-label">Date</div>
                        <div class="detail-value">${completionDate}</div>
                    </div>
                </div>

                <div class="footer">
                    <div class="signature-block">
                        <div class="signature-img">Sanket Rahangdale</div>
                        <div class="signature-title">Lead Instructor</div>
                    </div>
                    <div class="signature-block">
                        <div class="signature-img">Techno Skill Team</div>
                        <div class="signature-title">Program Director</div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; font-size: 0.7rem; color: #999;">
                    Certificate ID: TS-${Date.now().toString(36).toUpperCase()} • Verify at technoskill.com
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(wrapper);

    // 4. Generate PDF
    const opt = {
        margin: 0.2,
        filename: `Certificate_${userName.replace(/\s+/g, '_')}_TechnoSkill.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false
        },
        jsPDF: { unit: 'in', format: 'landscape', orientation: 'landscape' }
    };

    // Use html2pdf library
    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(wrapper).save().then(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            document.body.removeChild(wrapper); // Cleanup
            showNotification('Certificate downloaded successfully!', 'success');

            if (confirm("Download started. Would you like to view the certificate in browser as well?")) {
                viewDummyCertificate();
            }
        }).catch(err => {
            console.error('PDF Generation Error:', err);
            btn.innerHTML = originalText;
            btn.disabled = false;
            if (document.body.contains(wrapper)) document.body.removeChild(wrapper);
            alert('Download failed. Use the "View" button to view and print the certificate instead.');
        });
    } else {
        console.error('html2pdf library not loaded');
        btn.innerHTML = originalText;
        btn.disabled = false;
        if (document.body.contains(wrapper)) document.body.removeChild(wrapper);
        alert('PDF functionality not loaded. Please refresh the page.');
    }
}

function viewDummyCertificate() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Student Name' };
    const userName = currentUser.name;
    const courseTitle = "Certified Web Developer";
    const courseDuration = "45 Hours";
    const courseLevel = "Advanced";
    const completionDate = "Jan 15, 2024";

    const certificateWindow = window.open('', '_blank');
    certificateWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate of Completion - ${courseTitle}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Montserrat:wght@300;400;600&display=swap');
                
                body {
                    font-family: 'Montserrat', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #1a1a2e;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-height: 100vh;
                }
                
                /* Close Button Styling */
                .actions {
                    position: fixed;
                    top: 20px;
                    right: 30px;
                    z-index: 1000;
                    display: flex;
                    gap: 15px;
                }
                
                .btn {
                    padding: 10px 25px;
                    border: none;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    text-decoration: none;
                }
                
                .btn-close {
                    background: #ef4444;
                    color: white;
                }
                
                .btn-close:hover {
                    background: #dc2626;
                    transform: translateY(-2px);
                }
                
                .btn-print {
                    background: #8c52ff;
                    color: white;
                }
                
                .btn-print:hover {
                    background: #7c3aed;
                    transform: translateY(-2px);
                }

                .certificate-container {
                    position: relative;
                    margin-top: 60px; /* Space for buttons */
                    margin-bottom: 40px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }

                .certificate {
                    background: white;
                    width: 100%;
                    max-width: 1100px;
                    min-height: 750px;
                    padding: 50px;
                    position: relative;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                    border: 15px solid #fff;
                    outline: 5px solid #8c52ff;
                    background: #fff url('https://www.transparenttextures.com/patterns/cream-paper.png');
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    box-sizing: border-box;
                }
                
                /* Decorative Corners */
                .corner {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border: 3px solid #8c52ff;
                    z-index: 10;
                }
                
                @media (min-width: 768px) {
                    .corner { width: 150px; height: 150px; }
                }
                
                .top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
                .top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
                .bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
                .bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }
                
                /* Gold Seal */
                .seal {
                    position: absolute;
                    bottom: 60px;
                    right: 60px;
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, #ffd700, #ffaa00);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                    border: 4px dashed #b8860b;
                    transform: rotate(-15deg);
                }

                @media (min-width: 768px) {
                    .seal { width: 140px; height: 140px; right: 80px; }
                }
                
                .seal-inner {
                    width: 80%;
                    height: 80%;
                    border: 2px solid #b8860b;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                }
                
                .seal i { font-size: 2.5rem; color: #fff; margin-bottom: 2px; }
                .seal span { font-size: 0.7rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #fff; }
                
                @media (min-width: 768px) {
                    .seal i { font-size: 3rem; margin-bottom: 5px; }
                    .seal span { font-size: 0.8rem; }
                }

                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 20vw;
                    color: rgba(140, 82, 255, 0.03);
                    font-family: 'Cinzel', serif;
                    pointer-events: none;
                    z-index: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .watermark i { font-size: 15vw; }

                .header { margin-bottom: 20px; z-index: 20; width: 100%; }
                .header-logo {
                    font-family: 'Cinzel', serif;
                    font-size: 2rem;
                    color: #333;
                    font-weight: 700;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                @media (min-width: 768px) {
                    .header-logo { font-size: 2.2rem; margin-bottom: 30px; gap: 15px; }
                }
                
                .header-logo span { color: #8c52ff; }
                
                .cert-title {
                    font-family: 'Cinzel', serif;
                    font-size: 2rem;
                    color: #8c52ff;
                    margin: 0;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                    border-bottom: 3px double #e5e7eb;
                    padding-bottom: 10px;
                    display: inline-block;
                    width: 90%;
                    line-height: 1.2;
                }
                @media (min-width: 768px) {
                    .cert-title { font-size: 3.5rem; letter-spacing: 5px; width: 80%; }
                }
                
                .present-text {
                    font-size: 1rem;
                    color: #666;
                    margin-top: 15px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                @media (min-width: 768px) {
                    .present-text { font-size: 1.2rem; margin-top: 20px; }
                }

                .content { z-index: 20; width: 100%; }
                
                .student-name {
                    font-family: 'Great Vibes', cursive;
                    font-size: 3rem;
                    color: #1a1a2e;
                    margin: 10px 0;
                    text-shadow: 2px 2px 0px rgba(0,0,0,0.05);
                    padding: 0 10px;
                    background: linear-gradient(to right, transparent, rgba(140, 82, 255, 0.05), transparent);
                    word-break: break-word;
                }
                @media (min-width: 768px) {
                    .student-name { font-size: 5rem; padding: 0 20px; }
                }
                
                .course-intro { font-size: 0.9rem; color: #555; margin-bottom: 5px; }
                @media (min-width: 768px) {
                    .course-intro { font-size: 1.1rem; }
                }
                
                .course-name {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #333;
                    margin: 10px 0 20px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    line-height: 1.3;
                }
                @media (min-width: 768px) {
                    .course-name { font-size: 2.2rem; margin: 10px 0 30px 0; }
                }

                .details-grid {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin: 20px 0 30px 0;
                    z-index: 20;
                }
                @media (min-width: 768px) {
                    .details-grid { gap: 60px; margin: 30px 0 50px 0; }
                }
                
                .detail-box {
                    text-align: center;
                    background: #f8f9fe;
                    padding: 10px 15px;
                    border-radius: 8px;
                    border-bottom: 3px solid #8c52ff;
                    min-width: 120px;
                }
                @media (min-width: 768px) {
                    .detail-box { padding: 10px 20px; min-width: 150px; }
                }
                
                .detail-label {
                    font-size: 0.7rem;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 5px;
                }
                @media (min-width: 768px) {
                    .detail-label { font-size: 0.8rem; }
                }
                
                .detail-value {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #1a1a2e;
                }
                @media (min-width: 768px) {
                    .detail-value { font-size: 1.2rem; }
                }

                .footer {
                    width: 90%;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 20;
                    margin-top: auto;
                    margin-bottom: 40px;
                }
                @media (min-width: 768px) {
                    .footer { width: 80%; flex-direction: row; align-items: flex-end; }
                }
                
                .signature-block { text-align: center; }
                .signature-img { 
                    font-family: 'Great Vibes', cursive; 
                    font-size: 2rem; 
                    color: #1a1a2e; 
                    border-bottom: 2px solid #ccc;
                    padding: 0 20px 5px 20px;
                    margin-bottom: 5px;
                    display: inline-block;
                    min-width: 150px;
                }
                @media (min-width: 768px) {
                    .signature-img { font-size: 2.5rem; padding: 0 40px 10px 40px; margin-bottom: 10px; min-width: 200px; }
                }
                
                .signature-title { font-size: 0.8rem; color: #666; text-transform: uppercase; font-weight: 600; }
                @media (min-width: 768px) {
                    .signature-title { font-size: 0.9rem; }
                }
                
                .cert-meta {
                    position: absolute;
                    bottom: 10px;
                    left: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 0.65rem;
                    color: #999;
                    font-family: monospace;
                    padding: 0 10px;
                }
                @media (min-width: 768px) {
                    .cert-meta { bottom: 15px; font-size: 0.75rem; }
                }

                @media print {
                    .actions { display: none; }
                    body { background: white; padding: 0; }
                    .certificate-container { margin: 0; }
                    .certificate { 
                        box-shadow: none; 
                        margin: 0; 
                        border: none; 
                        width: 100%; 
                        height: 100vh; 
                        max-width: none;
                    }
                    .seal { bottom: 60px; right: 80px; }
                }
            </style>
        </head>
        <body>
            <div class="actions">
                <button class="btn btn-print" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
                <button class="btn btn-close" onclick="window.close()"><i class="fas fa-times"></i> Close Window</button>
            </div>
            
            <div class="certificate-container">
                <div class="certificate">
                    <!-- Decorative Elements -->
                    <div class="corner top-left"></div>
                    <div class="corner top-right"></div>
                    <div class="corner bottom-left"></div>
                    <div class="corner bottom-right"></div>
                    
                    <div class="watermark"><i class="fas fa-award"></i></div>
                    
                    <div class="seal">
                        <div class="seal-inner">
                            <i class="fas fa-medal"></i>
                            <span>Verified</span>
                            <span>Excellence</span>
                        </div>
                    </div>

                    <!-- Header -->
                    <div class="header">
                        <div class="header-logo">
                            <i class="fas fa-graduation-cap" style="color: #8c52ff; font-size: 2.5rem;"></i>
                            Techno<span>Skill</span>
                        </div>
                        <h1 class="cert-title">Certificate of Completion</h1>
                        <p class="present-text">This is to certify that</p>
                    </div>

                    <!-- Main Content -->
                    <div class="content">
                        <div class="student-name">${userName}</div>
                        <p class="course-intro">has successfully completed the comprehensive training course</p>
                        <div class="course-name">${courseTitle}</div>
                    </div>

                    <!-- Course Meta -->
                    <div class="details-grid">
                        <div class="detail-box">
                            <div class="detail-label">Duration</div>
                            <div class="detail-value">${courseDuration}</div>
                        </div>
                        <div class="detail-box">
                            <div class="detail-label">Competency</div>
                            <div class="detail-value">${courseLevel}</div>
                        </div>
                        <div class="detail-box">
                            <div class="detail-label">Completion Date</div>
                            <div class="detail-value">${completionDate}</div>
                        </div>
                    </div>

                    <!-- Footer Signatures -->
                    <div class="footer">
                        <div class="signature-block">
                            <div class="signature-img">Sanket Rahangdale</div>
                            <div class="signature-title">Lead Instructor</div>
                        </div>
                        <div class="signature-block">
                            <div class="signature-img">Techno Skill Team</div>
                            <div class="signature-title">Program Director</div>
                        </div>
                    </div>

                    <div class="cert-meta">
                        Certificate ID: TS-${Date.now().toString(36).toUpperCase()}-WEBDEV • Verify at technoskill.com/verify
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    certificateWindow.document.close();
}
