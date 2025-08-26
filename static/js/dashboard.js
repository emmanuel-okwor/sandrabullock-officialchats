// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check if user is logged in
    const user = EasyEdu.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize dashboard components
    updateWelcomeSection(user);
    renderStatsCards(user);
    renderRecentActivity(user);
    renderQuickActions(user);
    renderUpcomingDeadlines(user);
    setupEventListeners();
}

function updateWelcomeSection(user) {
    const welcomeName = document.getElementById('welcomeName');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userName = document.getElementById('userName');
    
    if (welcomeName) {
        welcomeName.textContent = user.name.split(' ')[0];
    }
    
    if (userName) {
        userName.textContent = user.name;
    }
    
    if (welcomeMessage) {
        const messages = {
            member: "Ready to continue your learning journey?",
            instructor: "Ready to inspire and educate today?"
        };
        welcomeMessage.textContent = messages[user.role] || messages.member;
    }
}

function renderStatsCards(user) {
    const statsContainer = document.getElementById('statsCards');
    if (!statsContainer) return;
    
    const stats = getStatsData(user);
    
    statsContainer.innerHTML = stats.map(stat => `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card stats-card border-0 shadow-sm h-100">
                <div class="card-body text-center">
                    <div class="d-flex align-items-center justify-content-center mb-3">
                        <div class="bg-${stat.color} bg-opacity-10 p-3 rounded-circle">
                            <i class="fas ${stat.icon} text-${stat.color} fa-2x"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1">${stat.value}</h3>
                    <p class="text-muted mb-0">${stat.label}</p>
                    <small class="text-${stat.changeColor}">${stat.change}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatsData(user) {
    if (user.role === 'instructor') {
        return [
            {
                value: '12',
                label: 'Active Courses',
                icon: 'fa-book',
                color: 'primary',
                change: '+2 this month',
                changeColor: 'success'
            },
            {
                value: '248',
                label: 'Total Students',
                icon: 'fa-users',
                color: 'success',
                change: '+15 this week',
                changeColor: 'success'
            },
            {
                value: '36',
                label: 'Pending Reviews',
                icon: 'fa-tasks',
                color: 'warning',
                change: '8 due today',
                changeColor: 'danger'
            },
            {
                value: '4.8',
                label: 'Average Rating',
                icon: 'fa-star',
                color: 'info',
                change: '+0.2 this month',
                changeColor: 'success'
            }
        ];
    } else {
        return [
            {
                value: '5',
                label: 'Enrolled Courses',
                icon: 'fa-book',
                color: 'primary',
                change: '+1 this month',
                changeColor: 'success'
            },
            {
                value: '12',
                label: 'Assignments Due',
                icon: 'fa-tasks',
                color: 'warning',
                change: '3 due today',
                changeColor: 'danger'
            },
            {
                value: '85%',
                label: 'Average Grade',
                icon: 'fa-chart-line',
                color: 'success',
                change: '+5% this month',
                changeColor: 'success'
            },
            {
                value: '28',
                label: 'Study Hours',
                icon: 'fa-clock',
                color: 'info',
                change: 'This week',
                changeColor: 'muted'
            }
        ];
    }
}

function renderRecentActivity(user) {
    const activityContainer = document.getElementById('activityList');
    if (!activityContainer) return;
    
    const activities = getRecentActivities(user);
    
    activityContainer.innerHTML = activities.map(activity => `
        <div class="activity-item d-flex align-items-start">
            <div class="activity-icon bg-${activity.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                <i class="fas ${activity.icon} text-${activity.color}"></i>
            </div>
            <div class="flex-grow-1">
                <p class="mb-1">${activity.description}</p>
                <small class="text-muted">${EasyEdu.formatTimeAgo(activity.time)}</small>
            </div>
        </div>
    `).join('');
}

function getRecentActivities(user) {
    const baseActivities = [
        {
            description: 'Submitted assignment "Data Structures Project"',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            icon: 'fa-upload',
            color: 'success'
        },
        {
            description: 'Received grade for "Machine Learning Quiz"',
            time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            icon: 'fa-star',
            color: 'warning'
        },
        {
            description: 'Joined study group "Advanced Algorithms"',
            time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            icon: 'fa-users',
            color: 'info'
        }
    ];
    
    if (user.role === 'instructor') {
        return [
            {
                description: 'Graded 15 assignments for "Web Development"',
                time: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                icon: 'fa-check',
                color: 'success'
            },
            {
                description: 'Created new assignment "React Components"',
                time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                icon: 'fa-plus',
                color: 'primary'
            },
            {
                description: 'Published course "Advanced JavaScript"',
                time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                icon: 'fa-book',
                color: 'info'
            }
        ];
    }
    
    return baseActivities;
}

function renderQuickActions(user) {
    const actionsContainer = document.getElementById('quickActions');
    if (!actionsContainer) return;
    
    const actions = getQuickActions(user);
    
    actionsContainer.innerHTML = actions.map(action => `
        <a href="${action.href}" class="btn btn-outline-${action.color} d-flex align-items-center justify-content-start">
            <i class="fas ${action.icon} me-2"></i>
            ${action.label}
        </a>
    `).join('');
}

function getQuickActions(user) {
    if (user.role === 'instructor') {
        return [
            {
                label: 'Create Course',
                href: 'courses.html',
                icon: 'fa-plus',
                color: 'primary'
            },
            {
                label: 'Grade Assignments',
                href: 'assignments.html',
                icon: 'fa-tasks',
                color: 'warning'
            },
            {
                label: 'Send Announcement',
                href: 'chat.html',
                icon: 'fa-bullhorn',
                color: 'info'
            },
            {
                label: 'View Analytics',
                href: '#',
                icon: 'fa-chart-bar',
                color: 'success'
            }
        ];
    } else {
        return [
            {
                label: 'Browse Courses',
                href: 'courses.html',
                icon: 'fa-search',
                color: 'primary'
            },
            {
                label: 'Submit Assignment',
                href: 'assignments.html',
                icon: 'fa-upload',
                color: 'success'
            },
            {
                label: 'Join Study Group',
                href: 'chat.html',
                icon: 'fa-users',
                color: 'info'
            },
            {
                label: 'View Grades',
                href: '#',
                icon: 'fa-star',
                color: 'warning'
            }
        ];
    }
}

function renderUpcomingDeadlines(user) {
    const deadlinesContainer = document.getElementById('upcomingDeadlines');
    if (!deadlinesContainer) return;
    
    const deadlines = getUpcomingDeadlines(user);
    
    if (deadlines.length === 0) {
        deadlinesContainer.innerHTML = `
            <div class="col-12 text-center text-muted py-4">
                <i class="fas fa-calendar-check fa-3x mb-3 opacity-50"></i>
                <p>No upcoming deadlines</p>
            </div>
        `;
        return;
    }
    
    deadlinesContainer.innerHTML = deadlines.map(deadline => `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card border-start border-${deadline.urgency} border-4">
                <div class="card-body">
                    <h6 class="card-title">${deadline.title}</h6>
                    <p class="card-text text-muted small">${deadline.course}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-${deadline.urgency}">${EasyEdu.formatDate(deadline.dueDate)}</small>
                        <span class="badge bg-${deadline.urgency}">${deadline.status}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getUpcomingDeadlines(user) {
    const now = new Date();
    
    if (user.role === 'instructor') {
        return [
            {
                title: 'Grade Midterm Exams',
                course: 'Computer Science 101',
                dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
                status: 'Due Soon',
                urgency: 'warning'
            },
            {
                title: 'Submit Final Grades',
                course: 'Data Structures',
                dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
                status: 'Upcoming',
                urgency: 'info'
            }
        ];
    } else {
        return [
            {
                title: 'React Project Submission',
                course: 'Web Development',
                dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day
                status: 'Due Tomorrow',
                urgency: 'danger'
            },
            {
                title: 'Math Quiz',
                course: 'Calculus II',
                dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
                status: 'Due Soon',
                urgency: 'warning'
            },
            {
                title: 'Essay Draft',
                course: 'English Literature',
                dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
                status: 'Upcoming',
                urgency: 'info'
            }
        ];
    }
}

function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Notification dropdown
    const notificationDropdown = document.getElementById('notificationDropdown');
    if (notificationDropdown) {
        notificationDropdown.addEventListener('click', function() {
            // Mark notifications as read
            const badge = document.getElementById('notificationBadge');
            if (badge) {
                setTimeout(() => {
                    badge.style.display = 'none';
                }, 500);
            }
        });
    }
}