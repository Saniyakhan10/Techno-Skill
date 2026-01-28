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

// Google Login simulation - SMART ACCOUNT PICKER
function handleGoogleLogin() {
    const modal = document.getElementById('google-selector-modal');
    if (!modal) {
        // Fallback for pages without modal
        const btn = document.querySelector('.btn-google');
        if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        setTimeout(() => {
            const user = { name: "Saniya Khan", email: "saniyakhan@techno.com", role: "student", avatar: "https://ui-avatars.com/api/?name=Saniya+Khan&background=8c52ff&color=fff&size=128" };
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        }, 1000);
        return;
    }

    // Show the selector modal
    modal.style.display = 'flex';
    renderGoogleAccounts();
}

function renderGoogleAccounts() {
    const accountsList = document.getElementById('google-accounts-list');
    const savedAccounts = JSON.parse(localStorage.getItem('saved_google_accounts')) || [];

    let html = '';

    // Always include a default "Project Owner" account for quick testing
    const defaultAccount = { name: "Saniya Khan", email: "saniyakhan@techno.com", avatar: "https://ui-avatars.com/api/?name=Saniya+Khan&background=8c52ff&color=fff&size=32" };
    const allAccounts = [defaultAccount, ...savedAccounts.filter(a => a.email !== defaultAccount.email)];

    allAccounts.forEach(user => {
        html += `
            <div onclick="executeGoogleLogin('${user.name.replace(/'/g, "\\'")}', '${user.email}')" 
                 style="padding: 12px 24px; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f1f3f4;" 
                 onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                <img src="${user.avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
                <div style="text-align: left;">
                    <div style="font-size: 14px; font-weight: 500; color: #3c4043;">${user.name}</div>
                    <div style="font-size: 12px; color: #5f6368;">${user.email}</div>
                </div>
            </div>
        `;
    });

    html += `
        <div onclick="showGoogleSetup()" 
             style="padding: 12px 24px; display: flex; align-items: center; gap: 15px; cursor: pointer; color: #1a73e8; font-size: 14px; font-weight: 500;" 
             onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
            <i class="fas fa-user-circle" style="font-size: 20px;"></i>
            Use another account
        </div>
    `;

    accountsList.innerHTML = html;
}

function showGoogleSetup() {
    const accountsList = document.getElementById('google-accounts-list');
    accountsList.innerHTML = `
        <div id="google-setup" style="padding: 0 24px 24px;">
            <p style="font-size: 14px; text-align: left; margin-bottom: 15px; color: #5f6368;">Enter details of the Google Account to add:</p>
            <input type="text" id="google-name-input" placeholder="Your Name" style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; outline: none;">
            <input type="email" id="google-email-input" placeholder="Your Email" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; outline: none;">
            <button onclick="confirmGoogleLogin()" style="width: 100%; padding: 10px; background: #1a73e8; color: white; border: none; border-radius: 4px; font-weight: 500; cursor: pointer;">Sign In</button>
            <button onclick="renderGoogleAccounts()" style="width: 100%; padding: 10px; background: transparent; color: #5f6368; border: none; font-size: 13px; margin-top: 5px; cursor: pointer;">Cancel</button>
        </div>
    `;
}

function confirmGoogleLogin() {
    const name = document.getElementById('google-name-input').value.trim();
    const email = document.getElementById('google-email-input').value.trim();

    if (!name || !email) {
        alert('Please enter both name and email.');
        return;
    }

    // Save for future session list
    let savedAccounts = JSON.parse(localStorage.getItem('saved_google_accounts')) || [];
    if (!savedAccounts.find(a => a.email === email)) {
        savedAccounts.push({
            name: name,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`
        });
        localStorage.setItem('saved_google_accounts', JSON.stringify(savedAccounts));
    }

    executeGoogleLogin(name, email);
}

function executeGoogleLogin(name, email) {
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
    const user = { name, email, role: 'student', avatar };

    // Set current session
    localStorage.setItem('currentUser', JSON.stringify(user));

    const modal = document.getElementById('google-selector-modal');
    if (modal) {
        modal.innerHTML = `
            <div style="background: white; width: 100%; max-width: 400px; border-radius: 8px; padding: 50px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                <div class="google-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #4285F4; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p style="font-family: 'Roboto', arial, sans-serif; color: #202124;">Logging you in as <b>${name}</b>...</p>
                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
            </div>
        `;
    }

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('login.html')) {
        updateAuthUI();
    }
});
