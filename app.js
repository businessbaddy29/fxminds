// js/app.js
// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');

// Login Form Handler
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginId').value;
    const password = document.getElementById('password').value;
    
    try {
      // For demo purposes, using localStorage instead of Firebase
      const users = JSON.parse(localStorage.getItem('fxminds_users')) || [];
      const user = users.find(u => (u.email === email || u.mobile === email) && u.password === password);
      
      if (user) {
        // Store user in session
        sessionStorage.setItem('fxminds_current_user', JSON.stringify(user));
        
        // Show success message
        showNotification('Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        showNotification('Invalid email/mobile or password', 'error');
      }
    } catch (error) {
      showNotification('Login failed: ' + error.message, 'error');
    }
  });
}

// Register Form Handler
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    
    try {
      // For demo purposes, using localStorage instead of Firebase
      const users = JSON.parse(localStorage.getItem('fxminds_users')) || [];
      
      // Check if user already exists
      if (users.find(u => u.email === email || u.mobile === mobile)) {
        showNotification('User with this email or mobile already exists', 'error');
        return;
      }
      
      // Create new user
      const newUser = {
        id: 'USER' + Date.now(),
        name,
        email,
        mobile,
        password,
        createdAt: new Date().toISOString(),
        emailVerified: true,
        status: 'active'
      };
      
      users.push(newUser);
      localStorage.setItem('fxminds_users', JSON.stringify(users));
      
      showNotification('Registration successful! Please login.', 'success');
      
      // Redirect to login page
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } catch (error) {
      showNotification('Registration failed: ' + error.message, 'error');
    }
  });
}

// Logout Handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      sessionStorage.removeItem('fxminds_current_user');
      window.location.href = 'index.html';
    }
  });
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.textContent = message;
    notification.className = 'notification show';
    
    if (type === 'success') {
      notification.classList.add('success');
    } else if (type === 'error') {
      notification.classList.add('error');
    }
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 5000);
  }
}

// Check if user is logged in
function checkAuth() {
  const currentUser = sessionStorage.getItem('fxminds_current_user');
  
  // Pages that require authentication
  const authPages = ['dashboard.html', 'profile.html', 'settings.html'];
  
  // Get current page
  const currentPage = window.location.pathname.split('/').pop();
  
  // If user is not logged in and tries to access auth page, redirect to login
  if (!currentUser && authPages.includes(currentPage)) {
    window.location.href = 'login.html';
    return false;
  }
  
  // If user is logged in and tries to access login/register page, redirect to dashboard
  if (currentUser && (currentPage === 'login.html' || currentPage === 'register.html')) {
    window.location.href = 'dashboard.html';
    return false;
  }
  
  return true;
}

// Initialize auth check
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  
  // Load user data if on dashboard
  const currentUser = sessionStorage.getItem('fxminds_current_user');
  if (currentUser && window.location.pathname.includes('dashboard.html')) {
    const user = JSON.parse(currentUser);
    
    // Update user info in header
    const userNameElement = document.querySelector('.user-name');
    const userIdElement = document.querySelector('.user-id');
    
    if (userNameElement) userNameElement.textContent = user.name;
    if (userIdElement) userIdElement.textContent = `ID: ${user.id}`;
    
    // Update referral link
    const referralLink = document.getElementById('referralLink');
    if (referralLink) {
      referralLink.value = `https://yourusername.github.io/fxminds-website/register.html?ref=${user.id}`;
    }
  }
});
