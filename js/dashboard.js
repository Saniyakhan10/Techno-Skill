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

function continueLearning(courseId) {
    const course = getCourseById(courseId);
    if (course) {
        showNotification(`Continuing "${course.title}" - Opening course player...`, 'info');
        updateCourseProgress(courseId, getPurchasedCourses().find(item => item.id === courseId)?.progress || 0);
    }
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
                <td>${enr.courseTitle}</td>
                <td>${formatDate(enr.date)}</td>
                <td class="amount-cell">₹${(parseInt(enr.price) || 0).toLocaleString('en-IN')}</td>
            </tr>
        `).join('');
    } else {
        enrollmentList.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No enrollments found yet.</td></tr>';
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

    testView.innerHTML = `
        <div class="test-active-container">
            <div class="test-results">
                <h2>Test Completed!</h2>
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
