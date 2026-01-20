// ===== COURSE DATA =====
const courses = [{
    id: 1,
    title: "Complete Web Development Bootcamp 2023",
    description: "Master HTML, CSS, JavaScript, React, Node.js, MongoDB and build real-world projects. Become a full-stack web developer with this comprehensive course.",
    price: 7499,
    image: "assets/images/web-dev-course.png",
    rating: 4.8,
    duration: "45 hours",
    level: "Beginner",
    category: "web",
    certificate: true,
    featured: true,
    trending: true,
    instructor: "Sanket Rahangdale",
    instructorBio: "Senior Full-Stack Developer with 10+ years experience",
    students: 12500,
    lectures: 320,
    quizzes: 45,
    assignments: 15,
    resources: 28,
    lastUpdated: "2023-10-15",
    icon: "fa-code",
    modules: [
        {
            title: "Module 1: HTML5 Fundamentals",
            duration: "2:15:00",
            videoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU" // HTML Tutorial
        },
        {
            title: "Module 2: CSS3 Styling & Flexbox",
            duration: "3:45:00",
            videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc" // CSS Tutorial
        },
        {
            title: "Module 3: JavaScript Basics",
            duration: "4:30:00",
            videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk" // JS Tutorial
        },
        {
            title: "Module 4: React.js Essentials",
            duration: "5:15:00",
            videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8" // React Tutorial
        },
        {
            title: "Module 5: Node.js Backend",
            duration: "4:00:00",
            videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE" // Node.js
        }
    ]
},
{
    id: 2,
    title: "Data Science & Machine Learning Masterclass",
    description: "Learn Python, Pandas, NumPy, Matplotlib, Scikit-learn, TensorFlow, and build ML models from scratch. Practical projects included.",
    price: 8299,
    image: "assets/images/data-science-course.png",
    rating: 4.9,
    duration: "60 hours",
    level: "Intermediate",
    category: "data",
    certificate: true,
    featured: true,
    trending: true,
    instructor: "Chandu Bopche",
    instructorBio: "Data Scientist at Google, PhD in Computer Science",
    students: 8900,
    lectures: 280,
    quizzes: 35,
    assignments: 12,
    resources: 42,
    lastUpdated: "2023-11-20",
    icon: "fa-brain"
},
{
    id: 3,
    title: "Mobile App Development with Flutter & Dart",
    description: "Build beautiful native apps for iOS and Android using Flutter. Learn state management, APIs, Firebase, and app deployment.",
    price: 6649,
    image: "assets/images/mobile-dev-course.png",
    rating: 4.7,
    duration: "40 hours",
    level: "Intermediate",
    category: "mobile",
    certificate: true,
    featured: true,
    trending: false,
    instructor: "Shivam Patle",
    instructorBio: "Flutter Expert, Created 50+ apps on Play Store & App Store",
    students: 5600,
    lectures: 210,
    quizzes: 30,
    assignments: 10,
    resources: 25,
    lastUpdated: "2023-09-10",
    icon: "fa-mobile-screen-button"
},
{
    id: 4,
    title: "Digital Marketing Masterclass 2023",
    description: "Master SEO, Social Media Marketing, Content Marketing, Google Analytics, Email Marketing, and grow any business online.",
    price: 5799,
    image: "https://images.unsplash.com/photo-1504868584819-f8e90526354c?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    duration: "35 hours",
    level: "Beginner",
    category: "marketing",
    certificate: true,
    featured: false,
    trending: true,
    instructor: "Mohit Awsare",
    instructorBio: "Digital Marketing Director, Helped 500+ businesses grow",
    students: 11200,
    lectures: 180,
    quizzes: 25,
    assignments: 8,
    resources: 35,
    lastUpdated: "2023-10-05",
    icon: "fa-bullhorn"
},
{
    id: 5,
    title: "UI/UX Design Fundamentals & Figma Mastery",
    description: "Learn user interface and user experience design principles, wireframing, prototyping, and design tools like Figma and Adobe XD.",
    price: 4999,
    image: "assets/images/web-dev-course.png",
    rating: 4.8,
    duration: "30 hours",
    level: "Beginner",
    category: "design",
    certificate: true,
    featured: false,
    trending: true,
    instructor: "Priya Deshmukh",
    instructorBio: "Lead UI/UX Designer at Apple, 8+ years design experience",
    students: 7400,
    lectures: 150,
    quizzes: 20,
    assignments: 6,
    resources: 22,
    lastUpdated: "2023-08-22",
    icon: "fa-pen-ruler"
},
{
    id: 6,
    title: "Python Programming for Beginners to Advanced",
    description: "Start your programming journey with Python. Learn syntax, data structures, OOP, algorithms, and build real applications.",
    price: 4149,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    duration: "25 hours",
    level: "Beginner",
    category: "data",
    certificate: true,
    featured: false,
    trending: false,
    instructor: "Rohan Bhosale",
    instructorBio: "Computer Science Professor, Python Expert",
    students: 18300,
    lectures: 120,
    quizzes: 15,
    assignments: 5,
    resources: 18,
    lastUpdated: "2023-07-15",
    icon: "fa-terminal"
},
{
    id: 7,
    title: "Advanced JavaScript: Patterns & Performance",
    description: "Master modern JavaScript concepts, design patterns, async programming, performance optimization, and build scalable apps.",
    price: 6229,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    duration: "20 hours",
    level: "Advanced",
    category: "web",
    certificate: true,
    featured: true,
    trending: true,
    instructor: "Akash Wankhede",
    instructorBio: "JavaScript Architect, Author of 'Modern JS Patterns'",
    students: 4200,
    lectures: 95,
    quizzes: 12,
    assignments: 4,
    resources: 15,
    lastUpdated: "2023-11-30",
    icon: "fa-bolt"
},
{
    id: 8,
    title: "Blockchain & Cryptocurrency Fundamentals",
    description: "Understand blockchain technology, smart contracts, cryptocurrency markets, and how to build decentralized applications (dApps).",
    price: 7499,
    image: "https://images.unsplash.com/photo-1640340434861-3d4c4d4f0d6f?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    duration: "28 hours",
    level: "Intermediate",
    category: "business",
    certificate: true,
    featured: false,
    trending: true,
    instructor: "Vikram Shelar",
    instructorBio: "Blockchain Developer, Former Ethereum Core Contributor",
    students: 3100,
    lectures: 135,
    quizzes: 18,
    assignments: 7,
    resources: 20,
    lastUpdated: "2023-10-28",
    icon: "fa-link"
},
{
    id: 9,
    title: "Full-Stack React + Node.js: Build & Deploy Apps",
    description: "Build modern full-stack apps with React, Node.js, Express, and MongoDB. Learn auth, APIs, deployment, and best practices with real projects.",
    price: 7899,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    duration: "52 hours",
    level: "Intermediate",
    category: "web",
    certificate: true,
    featured: true,
    trending: true,
    instructor: "Sneha Patil",
    instructorBio: "Full-Stack Engineer, Built products for high-growth startups",
    students: 9800,
    lectures: 260,
    quizzes: 28,
    assignments: 14,
    resources: 34,
    lastUpdated: "2024-01-12",
    icon: "fa-layer-group"
},
{
    id: 10,
    title: "SQL Mastery: From Zero to Advanced Analytics",
    description: "Master SQL for analytics and data work: joins, window functions, CTEs, optimization, and building dashboards-ready datasets with exercises.",
    price: 4999,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    duration: "22 hours",
    level: "Beginner",
    category: "data",
    certificate: true,
    featured: false,
    trending: true,
    instructor: "Raj Mendhe",
    instructorBio: "Analytics Lead, SQL trainer for teams and universities",
    students: 15300,
    lectures: 140,
    quizzes: 22,
    assignments: 9,
    resources: 26,
    lastUpdated: "2023-12-18",
    icon: "fa-database"
},
{
    id: 11,
    title: "UI Systems: Design Tokens, Components & Prototyping",
    description: "Create scalable UI systems using Figma: tokens, components, variants, auto-layout, responsive patterns, and developer handoff workflows.",
    price: 5799,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    duration: "18 hours",
    level: "Intermediate",
    category: "design",
    certificate: true,
    featured: true,
    trending: false,
    instructor: "Kavita Khandare",
    instructorBio: "Product Designer, Design Systems specialist",
    students: 6100,
    lectures: 110,
    quizzes: 14,
    assignments: 8,
    resources: 19,
    lastUpdated: "2023-11-08",
    icon: "fa-object-group"
},
{
    id: 12,
    title: "Android Development with Kotlin: Modern Apps",
    description: "Build Android apps with Kotlin, Jetpack, Room, Retrofit, and Compose. Learn MVVM, navigation, testing, and publishing.",
    price: 7049,
    image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    duration: "38 hours",
    level: "Intermediate",
    category: "mobile",
    certificate: true,
    featured: false,
    trending: true,
    instructor: "Jay Parkhe",
    instructorBio: "Android Engineer, Kotlin + Compose educator",
    students: 5200,
    lectures: 205,
    quizzes: 20,
    assignments: 11,
    resources: 24,
    lastUpdated: "2024-02-02",
    icon: "fa-robot"
},
{
    id: 13,
    title: "Product Marketing: Positioning, Launches & Growth",
    description: "Learn positioning, messaging, pricing, go-to-market strategy, and executing high-performing product launches with real frameworks.",
    price: 5399,
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    duration: "16 hours",
    level: "Beginner",
    category: "marketing",
    certificate: true,
    featured: false,
    trending: false,
    instructor: "Aarti Gawande",
    instructorBio: "Product Marketer, led launches across SaaS and mobile apps",
    students: 8700,
    lectures: 95,
    quizzes: 12,
    assignments: 6,
    resources: 21,
    lastUpdated: "2023-09-28",
    icon: "fa-rocket"
},
{
    id: 14,
    title: "Cybersecurity Essentials: Protect Apps & Users",
    description: "Understand core security concepts: OWASP Top 10, authentication, secure APIs, encryption basics, threat modeling, and practical hardening.",
    price: 6649,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    duration: "24 hours",
    level: "Beginner",
    category: "business",
    certificate: true,
    featured: true,
    trending: true,
    instructor: "Aman Hasan",
    instructorBio: "Security Engineer, specializes in web app security",
    students: 6900,
    lectures: 130,
    quizzes: 18,
    assignments: 7,
    resources: 30,
    lastUpdated: "2024-03-05",
    icon: "fa-shield-halved"
},
{
    id: 15,
    title: "Cloud Fundamentals: AWS for Developers",
    description: "Learn AWS essentials for developers: IAM, EC2, S3, Lambda, API Gateway, CI/CD basics, and deploying real apps safely.",
    price: 7499,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    duration: "30 hours",
    level: "Intermediate",
    category: "web",
    certificate: true,
    featured: false,
    trending: true,
    instructor: "Gaurav Thakare",
    instructorBio: "Cloud Architect, helps teams migrate and scale",
    students: 4300,
    lectures: 160,
    quizzes: 16,
    assignments: 9,
    resources: 27,
    lastUpdated: "2024-01-27",
    icon: "fa-cloud"
},
{
    id: 16,
    title: "Data Visualization with Python: Dashboards & Storytelling",
    description: "Create compelling data visualizations using Matplotlib, Seaborn, Plotly, and build shareable dashboards with real-world storytelling.",
    price: 4549,
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    duration: "20 hours",
    level: "Beginner",
    category: "data",
    certificate: true,
    featured: false,
    trending: true,
    instructor: "Pooja Nayak",
    instructorBio: "Data Analyst, visualization and storytelling mentor",
    students: 10100,
    lectures: 125,
    quizzes: 15,
    assignments: 8,
    resources: 23,
    lastUpdated: "2023-12-05",
    icon: "fa-chart-simple",
    subjects: [
        { name: "Matplotlib Basics", ytLink: "https://www.youtube.com/watch?v=OZOOLe2ol6w" },
        { name: "Seaborn Visuals", ytLink: "https://www.youtube.com/watch?v=6GUc3R38beU" },
        { name: "Interactive Plotly", ytLink: "https://www.youtube.com/watch?v=f-nN6uVf60E" }
    ]
}
];

// ===== TEST DATA =====
const quizzes = {
    "web": [
        {
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Tool Markup Language", "Hyper Text Multi Language"],
            answer: 0
        },
        {
            question: "Which property is used to change the background color?",
            options: ["color", "bgcolor", "background-color", "fill"],
            answer: 2
        },
        {
            question: "What is the correct way to write a JavaScript array?",
            options: ["var colors = 1 = ('red'), 2 = ('green')", "var colors = ['red', 'green', 'blue']", "var colors = (1:'red', 2:'green')", "var colors = 'red', 'green', 'blue'"],
            answer: 1
        }
    ],
    "data": [
        {
            question: "Which library is used for data manipulation in Python?",
            options: ["Matplotlib", "Pandas", "Request", "Scipy"],
            answer: 1
        },
        {
            question: "What is the main purpose of Machine Learning?",
            options: ["Graphic Design", "Data Entry", "Building models from data", "Web Hosting"],
            answer: 2
        }
    ],
    "marketing": [
        {
            question: "What does SEO stand for?",
            options: ["Social Engine Optimization", "Search Engine Optimization", "Search Entry Operation", "Social Entry Optimization"],
            answer: 1
        }
    ],
    "design": [
        {
            question: "Which tool is primarily used for UI/UX design?",
            options: ["VS Code", "Figma", "Excel", "Postman"],
            answer: 1
        }
    ]
};


// ===== LOCALSTORAGE FUNCTIONS =====

// Initialize localStorage if empty
function initializeLocalStorage() {
    if (!localStorage.getItem('wishlist')) {
        localStorage.setItem('wishlist', JSON.stringify([]));
    }

    if (!localStorage.getItem('compare')) {
        localStorage.setItem('compare', JSON.stringify([]));
    }

    if (!localStorage.getItem('purchased')) {
        // Add some demo purchased courses
        const demoPurchased = [
            { id: 1, progress: 75, started: "2023-10-01", lastAccessed: "2023-11-15" },
            { id: 5, progress: 30, started: "2023-11-10", lastAccessed: "2023-11-20" }
        ];
        localStorage.setItem('purchased', JSON.stringify(demoPurchased));
    }

    if (!localStorage.getItem('nextCourseId')) {
        localStorage.setItem('nextCourseId', '17');
    }

    // Global Enrollments for Admin View
    if (!localStorage.getItem('allEnrollments')) {
        const demoEnrollments = [
            { id: 'enr_1', userId: 'user_001', studentName: 'Rahul Sharma', courseId: 1, courseTitle: 'Complete Web Development Bootcamp 2023', date: '2023-10-01', price: 7499 },
            { id: 'enr_2', userId: 'user_002', studentName: 'Priya Patel', courseId: 5, courseTitle: 'Digital Marketing Masterclass', date: '2023-11-10', price: 5799 }
        ];
        localStorage.setItem('allEnrollments', JSON.stringify(demoEnrollments));
    }
}

// Get all courses (merging static data with any locally created courses)
function getAllCourses() {
    const customCourses = JSON.parse(localStorage.getItem('customCourses')) || [];
    return [...courses, ...customCourses];
}

// Save a new custom course (Admin Feature)
function saveCustomCourse(courseData) {
    const customCourses = JSON.parse(localStorage.getItem('customCourses')) || [];
    // Generate next ID based on all existing courses
    const allCourses = getAllCourses();
    const maxId = allCourses.reduce((max, c) => Math.max(max, c.id), 0);

    const newCourse = {
        ...courseData,
        id: maxId + 1,
        students: 0,
        rating: 5.0, // Default for new course
        lectures: 0,
        quizzes: 0,
        assignments: 0,
        price: parseInt(courseData.price) || 0,
        image: courseData.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Better placeholder
        featured: false,
        trending: true,
        certificate: true
    };
    customCourses.push(newCourse);
    localStorage.setItem('customCourses', JSON.stringify(customCourses));
    return newCourse;
}

// Get course by ID
function getCourseById(id) {
    return getAllCourses().find(course => course.id === id);
}

// Get featured courses
function getFeaturedCourses() {
    return getAllCourses().filter(course => course.featured);
}

// Get trending courses
function getTrendingCourses() {
    return getAllCourses().filter(course => course.trending);
}

// ===== WISHLIST FUNCTIONS =====
function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function addToWishlist(courseId) {
    const wishlist = getWishlist();
    if (!wishlist.includes(courseId)) {
        wishlist.push(courseId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        return true;
    }
    return false;
}

function removeFromWishlist(courseId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(id => id !== courseId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function isInWishlist(courseId) {
    const wishlist = getWishlist();
    return wishlist.includes(courseId);
}

function getWishlistCourses() {
    const wishlistIds = getWishlist();
    return courses.filter(course => wishlistIds.includes(course.id));
}

// ===== COMPARE FUNCTIONS =====
function getCompareList() {
    return JSON.parse(localStorage.getItem('compare')) || [];
}

function addToCompare(courseId) {
    const compareList = getCompareList();
    if (compareList.length >= 3) {
        return { success: false, message: "Cannot compare more than 3 courses" };
    }

    if (!compareList.includes(courseId)) {
        compareList.push(courseId);
        localStorage.setItem('compare', JSON.stringify(compareList));
        updateCompareCount();
        return { success: true, message: "Course added to comparison" };
    }
    return { success: false, message: "Course already in comparison" };
}

function removeFromCompare(courseId) {
    let compareList = getCompareList();
    compareList = compareList.filter(id => id !== courseId);
    localStorage.setItem('compare', JSON.stringify(compareList));
    updateCompareCount();
}

function getCompareCourses() {
    const compareIds = getCompareList();
    return getAllCourses().filter(course => compareIds.includes(course.id));
}

function clearCompare() {
    localStorage.setItem('compare', JSON.stringify([]));
    updateCompareCount();
}

// ===== PURCHASED COURSES FUNCTIONS =====
function getPurchasedCourses() {
    return JSON.parse(localStorage.getItem('purchased')) || [];
}

function addPurchasedCourse(courseId) {
    const purchased = getPurchasedCourses();
    if (!purchased.find(item => item.id === courseId)) {
        purchased.push({
            id: courseId,
            progress: 0,
            started: new Date().toISOString().split('T')[0],
            lastAccessed: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('purchased', JSON.stringify(purchased));

        // Record global enrollment for Admin
        if (typeof recordGlobalEnrollment === 'function') {
            recordGlobalEnrollment(courseId);
        }

        return true;
    }
    return false;
}

// Record Global Enrollment (Admin visibility)
function recordGlobalEnrollment(courseId) {
    const course = getCourseById(courseId);
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) { }

    const studentName = currentUser ? currentUser.name : 'Unknown Student';
    const userId = currentUser ? currentUser.email : 'guest';

    if (!course) return; // Safety check

    const allEnrollments = JSON.parse(localStorage.getItem('allEnrollments')) || [];

    // Avoid duplicates for the same transaction today
    const today = new Date().toISOString().split('T')[0];
    const alreadyEnrolled = allEnrollments.find(e => e.courseId === courseId && e.userId === userId);

    if (alreadyEnrolled) return;

    allEnrollments.push({
        id: 'enr_' + Date.now(),
        userId: userId,
        studentName: studentName,
        courseId: course.id,
        courseTitle: course.title,
        date: today,
        price: course.price // Ensure course.price is used
    });

    localStorage.setItem('allEnrollments', JSON.stringify(allEnrollments));
}

// Get All Enrollments (For Admin Dashboard)
function getAllEnrollments() {
    return JSON.parse(localStorage.getItem('allEnrollments')) || [];
}

function updateCourseProgress(courseId, progress) {
    let purchased = getPurchasedCourses();
    const index = purchased.findIndex(item => item.id === courseId);
    if (index !== -1) {
        purchased[index].progress = progress;
        purchased[index].lastAccessed = new Date().toISOString().split('T')[0];
        localStorage.setItem('purchased', JSON.stringify(purchased));
        return true;
    }
    return false;
}

function getPurchasedCoursesWithDetails() {
    const purchased = getPurchasedCourses();
    return purchased.map(item => {
        const course = getCourseById(item.id);
        return { ...course, ...item };
    });
}

// ===== UTILITY FUNCTIONS =====
function updateWishlistCount() {
    const countElements = document.querySelectorAll('#wishlist-count');
    const count = getWishlist().length;
    countElements.forEach(element => {
        element.textContent = count > 0 ? `(${count})` : '';
    });
}

function updateCompareCount() {
    const countElements = document.querySelectorAll('#compare-count');
    const count = getCompareList().length;
    countElements.forEach(element => {
        element.textContent = count > 0 ? `(${count})` : '';
    });
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }

    return `<span class="course-rating">${stars} ${rating.toFixed(1)}</span>`;
}

// Create course card HTML - Enhanced Premium Version
function createCourseCard(course, options = {}) {
    const { showWishlistBtn = true, showCompareBtn = true, showBuyBtn = true } = options;
    const isWishlisted = isInWishlist(course.id);
    const iconClass = course.icon ? `fas ${course.icon}` : 'fas fa-graduation-cap';

    // Create shorter description for cards (first 30 characters)
    const shortDesc = course.description.length > 30
        ? course.description.substring(0, 30) + '... <span style="color: var(--primary); cursor: pointer; font-weight: 600;" onclick="event.stopPropagation(); showCoursePreview(' + course.id + ')">Read More</span>'
        : course.description;

    return `
        <div class="course-card-premium" data-id="${course.id}">
            <!-- Card Header with Image -->
            <div class="course-card-header">
                <img src="${course.image}" alt="${course.title}" class="course-card-image" loading="lazy" data-fallback="course">
                <div class="course-card-overlay"></div>
                
                <!-- Badges -->
                <div class="course-badges-premium">
                    ${course.featured ? '<span class="badge-featured"><i class="fas fa-bolt"></i> Featured</span>' : ''}
                    ${course.trending ? '<span class="badge-trending"><i class="fas fa-fire"></i> Trending</span>' : ''}
                </div>
                
                <!-- Wishlist Button -->
                ${showWishlistBtn ? `
                    <button class="wishlist-btn-premium ${isWishlisted ? 'active' : ''}" 
                            onclick="toggleWishlist(${course.id})" 
                            aria-label="Add to wishlist">
                        <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                ` : ''}
                
                <!-- Category Badge -->
                <div class="course-category-badge">
                    <i class="${iconClass}"></i>
                    <span>${course.category.charAt(0).toUpperCase() + course.category.slice(1)}</span>
                </div>
            </div>
            
            <!-- Card Body -->
            <div class="course-card-body">
                <!-- Top Meta (Level & Rating) -->
                <div class="course-meta-top">
                    <span class="level-badge level-${course.level.toLowerCase()}">
                        <i class="fas fa-signal"></i>
                        ${course.level}
                    </span>
                    <span class="rating-badge">
                        <i class="fas fa-star"></i>
                        ${course.rating.toFixed(1)}
                    </span>
                </div>
                
                <!-- Title -->
                <h3 class="course-card-title">${course.title}</h3>
                
                <!-- Short Description -->
                <p class="course-card-desc">${shortDesc}</p>
                
                <!-- Instructor Info -->
                <div class="course-instructor-info" onclick="event.stopPropagation(); showMentorProfile('${course.instructor.replace("'", "\\'")}')" style="cursor: pointer;">
                    <div class="instructor-avatar">
                        ${getMentorByName(course.instructor)
            ? `<img src="${getMentorByName(course.instructor).image}" alt="${course.instructor}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
            : '<i class="fas fa-user-tie"></i>'
        }
                    </div>
                    <div class="instructor-details">
                        <div class="instructor-name">${course.instructor}</div>
                        <div class="instructor-bio">${course.instructorBio || 'Expert Instructor'}</div>
                    </div>
                </div>
                
                <!-- Course Stats -->
                <div class="course-stats">
                    <div class="stat-item" title="Duration">
                        <i class="fas fa-clock"></i>
                        <span>${course.duration}</span>
                    </div>
                    <div class="stat-item" title="Students">
                        <i class="fas fa-users"></i>
                        <span>${course.students >= 1000 ? (course.students / 1000).toFixed(1) + 'k' : course.students}</span>
                    </div>
                    <div class="stat-item" title="Lectures">
                        <i class="fas fa-play-circle"></i>
                        <span>${course.lectures || 'N/A'} Ls</span>
                    </div>
                    <div class="stat-item" title="Certificate">
                        <i class="fas fa-certificate"></i>
                        <span>${course.certificate ? 'Cert.' : 'No'}</span>
                    </div>
                </div>
                
                <!-- Card Footer with Price and Buy Button -->
                <div class="course-card-footer">
                    <div class="price-section">
                        <span class="price-label">Price</span>
                        <span class="price-value">₹${course.price.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div class="action-buttons">
                        ${showBuyBtn ? `
                            <button class="btn-buy-now" onclick="buyCourse(${course.id})">
                                <i class="fas fa-shopping-cart"></i>
                                Buy Now
                            </button>
                        ` : ''}
                        ${showCompareBtn ? `
                            <button class="btn-compare" onclick="addToCompareList(${course.id})" 
                                    aria-label="Add to compare">
                                <i class="fas fa-exchange-alt"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Mentor Data for Popups
const mentorsData = {
    "Sanket Rahangdale": {
        name: "Sanket Rahangdale",
        role: "Senior Full-Stack Developer",
        experience: "10+ Years",
        image: "assets/images/mentors/sanket.jpg",
        bio: "Sanket is a veteran in web technologies. He has worked with several Fortune 500 companies and specializes in React, Node.js, and Cloud Architecture. He has mentored over 20,000 students globally.",
        skills: ["Web Development", "System Design", "Cloud Computing"]
    },
    "Chandu Bopche": {
        name: "Chandu Bopche",
        role: "Data Scientist at Google",
        experience: "8+ Years",
        image: "assets/images/mentors/chandu.jpg",
        bio: "Chandu is a Data Science expert with a PhD in Machine Learning. Currently working at Google, he brings real-world industry problems to the classroom. He is passionate about AI and Big Data.",
        skills: ["Machine Learning", "Python", "Data Analysis"]
    },
    "Shivam Patle": {
        name: "Shivam Patle",
        role: "Flutter Expert & Mobile Architect",
        experience: "6+ Years",
        image: "assets/images/mentors/shivam.jpg",
        bio: "Shivam has been building mobile apps since the early days of Flutter. He has published over 50 apps on the App Store and Play Store. His focus is on beautiful UI and smooth performance.",
        skills: ["App Development", "Flutter", "UI/UX Design"]
    },
    "Mohit Awsare": {
        name: "Mohit Awsare",
        role: "Digital Marketing Director",
        experience: "12+ Years",
        image: "assets/images/mentors/mohit.jpg",
        bio: "Mohit is a growth hacker who has helped hundreds of startups scale their business. He specializes in SEO, SEM, and performance marketing. He shares practical strategies that actually work.",
        skills: ["Digital Marketing", "SEO", "Growth Hacking"]
    },
    "Priya Deshmukh": {
        name: "Priya Deshmukh",
        role: "Lead UI/UX Designer at Apple",
        experience: "8+ Years",
        image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80",
        bio: "Priya is a visionary desinger at Apple. She focuses on creating intuitive user experiences that blend aesthetics with functionality. She has a keen eye for detail and design systems.",
        skills: ["UI Design", "UX Research", "Figma", "Design Thinking"]
    },
    "Rohan Bhosale": {
        name: "Rohan Bhosale",
        role: "Computer Science Professor & Python Expert",
        experience: "15+ Years",
        image: "https://images.unsplash.com/photo-1607990281513-2c110a256622?auto=format&fit=crop&w=800&q=80",
        bio: "Prof. Rohan has been teaching Python and algorithms for over a decade. His simplified teaching style makes complex concepts easy for beginners to grasp.",
        skills: ["Python", "Algorithms", "Backend Development"]
    },
    "Akash Wankhede": {
        name: "Akash Wankhede",
        role: "JavaScript Architect",
        experience: "9+ Years",
        image: "https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?auto=format&fit=crop&w=800&q=80",
        bio: "Akash is a JavaScript wizard. He specializes in React, Vue, and high-performance server-side JS. He is the author of 'Modern JS Patterns' and a frequent speaker at tech conferences.",
        skills: ["JavaScript", "React", "Next.js", "Performance Optimization"]
    },
    "Vikram Shelar": {
        name: "Vikram Shelar",
        role: "Blockchain Developer",
        experience: "7+ Years",
        image: "https://images.unsplash.com/photo-1614283233556-f35b0c801efc?auto=format&fit=crop&w=800&q=80",
        bio: "Vikram is a pioneer in decentralized technologies. As a former Ethereum core contributor, he brings deep technical insights into smart contracts and blockchain architecture.",
        skills: ["Blockchain", "Solidity", "Web3", "Ethereum"]
    },
    "Sneha Patil": {
        name: "Sneha Patil",
        role: "Full-Stack Engineer",
        experience: "8+ Years",
        image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=800&q=80",
        bio: "Sneha has built scalable products for several high-growth startups. She is an expert in the MERN stack and is passionate about mentoring women in tech.",
        skills: ["React", "Node.js", "MongoDB", "Express"]
    },
    "Raj Mendhe": {
        name: "Raj Mendhe",
        role: "Analytics Lead",
        experience: "10+ Years",
        image: "https://images.unsplash.com/photo-1621243804936-775306a8f2e3?auto=format&fit=crop&w=800&q=80",
        bio: "Raj is a data wizard who loves turning raw data into actionable insights. He has trained thousands of professionals in SQL and data analytics across top universities.",
        skills: ["SQL", "Data Analytics", "Power BI", "Tableau"]
    },
    "Kavita Khandare": {
        name: "Kavita Khandare",
        role: "Product Designer",
        experience: "6+ Years",
        image: "https://images.unsplash.com/photo-1567532939103-c053bb14b2b9?auto=format&fit=crop&w=800&q=80",
        bio: "Kavita specializes in building scalable design systems. She bridges the gap between design and development with efficient handoff workflows and component libraries.",
        skills: ["Figma", "Design Systems", "Prototyping", "UX Design"]
    },
    "Jay Parkhe": {
        name: "Jay Parkhe",
        role: "Android Engineer",
        experience: "7+ Years",
        image: "https://images.unsplash.com/photo-1603415854124-75485ea23788?auto=format&fit=crop&w=800&q=80",
        bio: "Jay is a Kotlin enthusiast and expert Android developer. He focuses on modern Android architecture patterns like MVVM and Jetpack Compose.",
        skills: ["Android", "Kotlin", "Jetpack Compose", "App Performance"]
    },
    "Aarti Gawande": {
        name: "Aarti Gawande",
        role: "Product Marketer",
        experience: "9+ Years",
        image: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
        bio: "Aarti has led marketing launches for top SaaS and mobile products. She is an expert in product positioning, messaging, and go-to-market strategies.",
        skills: ["Product Marketing", "GTM Strategy", "Branding", "Content Strategy"]
    },
    "Aman Hasan": {
        name: "Aman Hasan",
        role: "Security Engineer",
        experience: "8+ Years",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
        bio: "Aman is a cybersecurity specialist with a focus on web application security. He helps developers build secure apps by understanding the hacker's mindset.",
        skills: ["Cybersecurity", "Ethical Hacking", "Application Security", "OWASP"]
    },
    "Gaurav Thakare": {
        name: "Gaurav Thakare",
        role: "Cloud Architect",
        experience: "11+ Years",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        bio: "Gaurav is a certified Cloud Architect who has helped hundreds of teams migrate to the cloud and scale their operations globally.",
        skills: ["AWS", "Azure", "Cloud Migration", "Infrastructure as Code"]
    },
    "Pooja Nayak": {
        name: "Pooja Nayak",
        role: "Data Analyst",
        experience: "5+ Years",
        image: "https://images.unsplash.com/photo-1573166364524-d9dbfd8bbf83?auto=format&fit=crop&w=800&q=80",
        bio: "Pooja is passionate about data visualization and storytelling. She turns complex numbers into beautiful, interactive charts that tell a story.",
        skills: ["Data Visualization", "Python", "Plotly", "Business Intelligence"]
    },
    "Rajesh Kumar": {
        name: "Rajesh Kumar",
        role: "Cloud Solution Architect",
        experience: "15+ Years",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
        bio: "Rajesh is a certified AWS/Azure architect with over 15 years of industry experience. He has a deep understanding of infrastructure and DevOps practices.",
        skills: ["AWS", "Azure", "DevOps"]
    },
    "Priya Sharma": {
        name: "Priya Sharma",
        role: "UI/UX Design Lead",
        experience: "7+ Years",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        bio: "Priya is an award-winning designer with a passion for user-centric interfaces.",
        skills: ["UI Design", "UX Research", "Figma"]
    },
    "Aditi Verma": {
        name: "Aditi Verma",
        role: "Cyber Security Analyst",
        experience: "9+ Years",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        bio: "Aditi is an ethical hacker and security consultant specializing in penetration testing.",
        skills: ["Ethical Hacking", "Network Security", "Compliance"]
    }
};

function getMentorByName(name) {
    return mentorsData[name] || null;
}

// Initialize on page load
initializeLocalStorage();