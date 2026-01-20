/**
 * Authentication System for Techno Skill
 * Handles user sessions using localStorage
 */

const USERS = {
    student: {
        email: 'student@techno.com',
        password: '123456',
        name: 'Rahul Sharma',
        role: 'student',
        avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=8c52ff&color=fff'
    },
    admin: {
        email: 'admin@techno.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=22c55e&color=fff'
    }
};

// Check if user is logged in
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Login function
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Find user
    let user = null;
    if (email === USERS.student.email && password === USERS.student.password) {
        user = USERS.student;
    } else if (email === USERS.admin.email && password === USERS.admin.password) {
        user = USERS.admin;
    }

    if (user) {
        // Enforce role check based on tab selection (if on login page)
        if (typeof currentRole !== 'undefined' && user.role !== currentRole) {
            alert(`Please use the ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} tab to login with these credentials.`);
            return;
        }

        // Save session
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Show success
        const btn = document.querySelector('.btn-login');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

        setTimeout(() => {
            const redirectParams = localStorage.getItem('redirectAfterLogin');
            if (redirectParams) {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectParams;
            } else {
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    } else {
        alert('Invalid email or password!');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Authenticate helper for protected pages
function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// Update UI with user info
function updateAuthUI() {
    const user = getCurrentUser();
    const navIcons = document.querySelector('.nav-icons');

    if (user && navIcons) {
        // Find existing user icon
        const userLink = navIcons.querySelector('a[href="dashboard.html"]');
        if (userLink) {
            // Update to show avatar or different icon
            userLink.innerHTML = `<img src="${user.avatar}" class="nav-user-avatar" alt="User" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid white;">`;

            // Add logout button to nav
            if (!document.getElementById('logout-btn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.id = 'logout-btn';
                logoutBtn.className = 'icon-link';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt" title="Logout"></i>';
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    logout();
                };
                navIcons.appendChild(logoutBtn);
            }
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    // If not on login page, update UI
    if (!window.location.pathname.includes('login.html')) {
        updateAuthUI();
    }
});
