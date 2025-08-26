// EasyEdu Main JavaScript

// Global variables
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    currentUser = getCurrentUser();
    
    // Update navbar based on login status
    updateNavbar();
    
    // Add smooth scrolling to anchor links
    addSmoothScrolling();
    
    // Initialize tooltips if Bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
        initializeTooltips();
    }
}

function getCurrentUser() {
    // In a real app, this would check authentication status
    // For demo purposes, check localStorage
    const user = localStorage.getItem('easyedu_user');
    return user ? JSON.parse(user) : null;
}

function updateNavbar() {
    const navbarBrand = document.getElementById('navbar-brand');
    if (navbarBrand) {
        navbarBrand.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }
}

function addSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeTooltips() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Utility functions
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        console.log(message); // Fallback for pages without toast container
        return;
    }

    const toast = document.getElementById('authToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        
        // Update toast header icon based on type
        const toastHeader = toast.querySelector('.toast-header i');
        if (toastHeader) {
            toastHeader.className = `fas me-2 ${getToastIcon(type)}`;
        }
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

function getToastIcon(type) {
    switch(type) {
        case 'success':
            return 'fa-check-circle text-success';
        case 'error':
            return 'fa-exclamation-circle text-danger';
        case 'warning':
            return 'fa-exclamation-triangle text-warning';
        case 'info':
            return 'fa-info-circle text-info';
        default:
            return 'fa-check-circle text-success';
    }
}

function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTimeAgo(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Password should be at least 6 characters
    return password.length >= 6;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other files
window.EasyEdu = {
    getCurrentUser,
    showToast,
    formatDate,
    formatDateTime,
    formatTimeAgo,
    generateId,
    validateEmail,
    validatePassword,
    debounce
};