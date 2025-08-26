// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
});

function initializeAuthPage() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        initializeLoginForm();
    }
    
    if (signupForm) {
        initializeSignupForm();
    }
}

function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(loginForm)) {
            handleLogin();
        }
    });
}

function initializeSignupForm() {
    const signupForm = document.getElementById('signupForm');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    
    // Password confirmation validation
    confirmPasswordField.addEventListener('input', function() {
        validatePasswordMatch();
    });
    
    passwordField.addEventListener('input', function() {
        validatePasswordMatch();
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(signupForm) && validatePasswordMatch()) {
            handleSignup();
        }
    });
}

function validateForm(form) {
    let isValid = true;
    
    // Remove existing validation classes
    form.querySelectorAll('.form-control, .form-select').forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
    });
    
    // Validate each field
    form.querySelectorAll('.form-control[required], .form-select[required]').forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field.type === 'email' && !EasyEdu.validateEmail(field.value)) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field.type === 'password' && !EasyEdu.validatePassword(field.value)) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.add('is-valid');
        }
    });
    
    // Validate checkboxes
    form.querySelectorAll('input[type="checkbox"][required]').forEach(checkbox => {
        if (!checkbox.checked) {
            checkbox.classList.add('is-invalid');
            isValid = false;
        } else {
            checkbox.classList.add('is-valid');
        }
    });
    
    return isValid;
}

function validatePasswordMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
            confirmPassword.classList.add('is-invalid');
            confirmPassword.classList.remove('is-valid');
            return false;
        } else if (confirmPassword.value) {
            confirmPassword.classList.add('is-valid');
            confirmPassword.classList.remove('is-invalid');
            return true;
        }
    }
    
    return true;
}

function handleLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const spinner = loginBtn.querySelector('.spinner-border');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Show loading state
    btnText.classList.add('d-none');
    spinner.classList.remove('d-none');
    loginBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, you would make an API call here
        const user = {
            id: EasyEdu.generateId(),
            email: email,
            name: 'John Doe', // This would come from the API
            role: 'member', // This would come from the API
            loginTime: new Date().toISOString()
        };
        
        // Store user in localStorage (in real app, use secure storage)
        localStorage.setItem('easyedu_user', JSON.stringify(user));
        
        // Show success message
        EasyEdu.showToast('Welcome back to EasyEdu!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    }, 1500);
}

function handleSignup() {
    const signupBtn = document.getElementById('signupBtn');
    const btnText = signupBtn.querySelector('.btn-text');
    const spinner = signupBtn.querySelector('.spinner-border');
    const formData = new FormData(document.getElementById('signupForm'));
    
    // Show loading state
    btnText.classList.add('d-none');
    spinner.classList.remove('d-none');
    signupBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, you would make an API call here
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            role: formData.get('role')
        };
        
        // Show success message
        EasyEdu.showToast('Welcome to EasyEdu! Please sign in.', 'success');
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        
    }, 1500);
}

function logout() {
    // Clear user data
    localStorage.removeItem('easyedu_user');
    
    // Show logout message
    EasyEdu.showToast('You have been logged out successfully.', 'info');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Export logout function for use in other pages
window.logout = logout;