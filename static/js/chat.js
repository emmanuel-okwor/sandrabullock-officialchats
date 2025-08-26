// Chat JavaScript

let currentUser = null;
let currentChat = null;
let allChats = [];
let messages = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeChatPage();
});

function initializeChatPage() {
    // Check if user is logged in
    currentUser = EasyEdu.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    loadChats();
    setupEventListeners();
    startMessagePolling();
}

function loadChats() {
    // Mock chat data
    allChats = [
        {
            id: '1',
            type: 'course',
            title: 'Web Development - General',
            participants: ['Dr. Sarah Johnson', 'John Doe', 'Jane Smith', '+15 others'],
            lastMessage: 'Thanks for the great explanation!',
            lastMessageTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
            unreadCount: 2,
            avatar: 'fa-users'
        },
        {
            id: '2',
            type: 'private',
            title: 'Dr. Sarah Johnson',
            participants: ['Dr. Sarah Johnson'],
            lastMessage: 'Your project looks great, well done!',
            lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            unreadCount: 0,
            avatar: 'fa-user'
        },
        {
            id: '3',
            type: 'study',
            title: 'Algorithm Study Group',
            participants: ['Mike Chen', 'Lisa Park', 'Alex Rodriguez', '+3 others'],
            lastMessage: 'Let\'s meet tomorrow at 2 PM',
            lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            unreadCount: 5,
            avatar: 'fa-study'
        }
    ];
    
    renderChatList();
}

function renderChatList() {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;
    
    if (allChats.length === 0) {
        chatList.innerHTML = `
            <div class="text-center p-4 text-muted">
                <i class="fas fa-comments fa-2x mb-2"></i>
                <p>No conversations yet</p>
                <button class="btn btn-primary btn-sm" onclick="showNewChatModal()">
                    Start a conversation
                </button>
            </div>
        `;
        return;
    }
    
    chatList.innerHTML = allChats.map(chat => `
        <div class="chat-item ${currentChat && currentChat.id === chat.id ? 'active' : ''}" 
             onclick="selectChat('${chat.id}')">
            <div class="d-flex align-items-start">
                <div class="chat-avatar">
                    <i class="fas ${chat.avatar} text-primary"></i>
                </div>
                <div class="flex-grow-1 ms-2">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <h6 class="mb-0">${chat.title}</h6>
                        <small class="text-muted">${EasyEdu.formatTimeAgo(chat.lastMessageTime)}</small>
                    </div>
                    <p class="mb-1 text-muted small">${chat.lastMessage}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${chat.participants.slice(0, 2).join(', ')}${chat.participants.length > 2 ? '...' : ''}</small>
                        ${chat.unreadCount > 0 ? `
                            <span class="badge bg-primary rounded-pill">${chat.unreadCount}</span>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function selectChat(chatId) {
    currentChat = allChats.find(chat => chat.id === chatId);
    if (!currentChat) return;
    
    // Mark as read
    currentChat.unreadCount = 0;
    
    // Update UI
    updateChatHeader();
    loadMessages(chatId);
    showChatInput();
    renderChatList(); // Re-render to update active state
}

function updateChatHeader() {
    const chatTitle = document.getElementById('chatTitle');
    const chatStatus = document.getElementById('chatStatus');
    const noChatSelected = document.getElementById('noChatSelected');
    
    if (currentChat) {
        if (chatTitle) chatTitle.textContent = currentChat.title;
        if (chatStatus) {
            const statusText = {
                course: `${currentChat.participants.length} participants`,
                private: 'Private conversation',
                study: `Study group • ${currentChat.participants.length} members`
            };
            chatStatus.textContent = statusText[currentChat.type] || 'Active';
        }
        if (noChatSelected) noChatSelected.style.display = 'none';
    }
}

function loadMessages(chatId) {
    // Mock messages data
    const mockMessages = {
        '1': [
            {
                id: '1',
                senderId: 'instructor1',
                senderName: 'Dr. Sarah Johnson',
                message: 'Welcome to the Web Development course discussion!',
                timestamp: new Date(Date.now() - 60 * 60 * 1000),
                isOwn: false
            },
            {
                id: '2',
                senderId: 'member1',
                senderName: 'Jane Smith',
                message: 'Thank you! I\'m excited to learn React.',
                timestamp: new Date(Date.now() - 45 * 60 * 1000),
                isOwn: false
            },
            {
                id: '3',
                senderId: 'current',
                senderName: currentUser.name,
                message: 'Me too! Looking forward to the projects.',
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                isOwn: true
            }
        ],
        '2': [
            {
                id: '4',
                senderId: 'instructor1',
                senderName: 'Dr. Sarah Johnson',
                message: 'Hi John, I reviewed your latest assignment.',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                isOwn: false
            },
            {
                id: '5',
                senderId: 'current',
                senderName: currentUser.name,
                message: 'Thank you! How did I do?',
                timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
                isOwn: true
            },
            {
                id: '6',
                senderId: 'instructor1',
                senderName: 'Dr. Sarah Johnson',
                message: 'Your project looks great, well done! I\'ve left some feedback on specific components.',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                isOwn: false
            }
        ],
        '3': [
            {
                id: '7',
                senderId: 'member2',
                senderName: 'Mike Chen',
                message: 'Should we review sorting algorithms tomorrow?',
                timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
                isOwn: false
            },
            {
                id: '8',
                senderId: 'member3',
                senderName: 'Lisa Park',
                message: 'Good idea! I\'m struggling with quicksort.',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                isOwn: false
            }
        ]
    };
    
    messages = mockMessages[chatId] || [];
    renderMessages();
}

function renderMessages() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-comment fa-2x mb-3 opacity-50"></i>
                <p>No messages yet. Start the conversation!</p>
            </div>
        `;
        return;
    }
    
    messagesContainer.innerHTML = messages.map(message => `
        <div class="message ${message.isOwn ? 'own' : ''}">
            <div class="message-bubble">
                ${!message.isOwn ? `<div class="fw-bold mb-1" style="font-size: 0.875rem;">${message.senderName}</div>` : ''}
                <div>${message.message}</div>
                <div class="message-time text-end mt-1">
                    ${EasyEdu.formatDateTime(message.timestamp)}
                </div>
            </div>
        </div>
    `).join('');
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showChatInput() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.style.display = 'block';
    }
}

function setupEventListeners() {
    // New chat button
    const newChatBtn = document.getElementById('newChatBtn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', showNewChatModal);
    }
    
    // Message form
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', handleSendMessage);
    }
    
    // Chat search
    const chatSearch = document.getElementById('chatSearch');
    if (chatSearch) {
        chatSearch.addEventListener('input', EasyEdu.debounce(filterChats, 300));
    }
    
    // New chat form
    const chatType = document.getElementById('chatType');
    if (chatType) {
        chatType.addEventListener('change', handleChatTypeChange);
    }
    
    // Create chat button
    const createChatBtn = document.getElementById('createChatBtn');
    if (createChatBtn) {
        createChatBtn.addEventListener('click', handleCreateChat);
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

function handleSendMessage(e) {
    e.preventDefault();
    
    const messageInput = document.getElementById('messageText');
    const messageText = messageInput.value.trim();
    
    if (!messageText || !currentChat) return;
    
    // Create new message
    const newMessage = {
        id: EasyEdu.generateId(),
        senderId: 'current',
        senderName: currentUser.name,
        message: messageText,
        timestamp: new Date(),
        isOwn: true
    };
    
    // Add message to current chat
    messages.push(newMessage);
    
    // Update last message in chat list
    currentChat.lastMessage = messageText;
    currentChat.lastMessageTime = new Date();
    
    // Clear input
    messageInput.value = '';
    
    // Re-render
    renderMessages();
    renderChatList();
}

function filterChats() {
    const searchTerm = document.getElementById('chatSearch').value.toLowerCase();
    
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        const chatTitle = item.querySelector('h6').textContent.toLowerCase();
        const lastMessage = item.querySelector('p').textContent.toLowerCase();
        
        if (chatTitle.includes(searchTerm) || lastMessage.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function showNewChatModal() {
    // Populate course and user selects
    populateNewChatSelects();
    
    const modal = new bootstrap.Modal(document.getElementById('newChatModal'));
    modal.show();
}

function populateNewChatSelects() {
    const courseSelect = document.getElementById('selectedCourse');
    const userSelect = document.getElementById('selectedUser');
    
    // Mock data
    const courses = [
        { id: '1', name: 'Web Development' },
        { id: '2', name: 'Data Structures' },
        { id: '3', name: 'Machine Learning' }
    ];
    
    const users = [
        { id: '1', name: 'Dr. Sarah Johnson' },
        { id: '2', name: 'Mike Chen' },
        { id: '3', name: 'Lisa Park' },
        { id: '4', name: 'Alex Rodriguez' }
    ];
    
    if (courseSelect) {
        courseSelect.innerHTML = '<option value="">Choose a course</option>' +
            courses.map(course => `<option value="${course.id}">${course.name}</option>`).join('');
    }
    
    if (userSelect) {
        userSelect.innerHTML = '<option value="">Choose a user</option>' +
            users.map(user => `<option value="${user.id}">${user.name}</option>`).join('');
    }
}

function handleChatTypeChange() {
    const chatType = document.getElementById('chatType').value;
    const courseSelect = document.getElementById('courseSelect');
    const userSelect = document.getElementById('userSelect');
    
    // Show/hide relevant selects based on chat type
    if (chatType === 'course') {
        courseSelect.style.display = 'block';
        userSelect.style.display = 'none';
    } else if (chatType === 'private') {
        courseSelect.style.display = 'none';
        userSelect.style.display = 'block';
    } else if (chatType === 'study') {
        courseSelect.style.display = 'block';
        userSelect.style.display = 'block';
    } else {
        courseSelect.style.display = 'none';
        userSelect.style.display = 'none';
    }
}

function handleCreateChat() {
    const form = document.getElementById('newChatForm');
    const formData = new FormData(form);
    
    const chatType = formData.get('chatType');
    const subject = formData.get('chatSubject');
    
    if (!chatType || !subject) {
        EasyEdu.showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Create new chat
    const newChat = {
        id: EasyEdu.generateId(),
        type: chatType,
        title: subject,
        participants: [currentUser.name],
        lastMessage: 'Chat created',
        lastMessageTime: new Date(),
        unreadCount: 0,
        avatar: chatType === 'private' ? 'fa-user' : 'fa-users'
    };
    
    // Add to chats
    allChats.unshift(newChat);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('newChatModal'));
    modal.hide();
    
    // Reset form
    form.reset();
    
    // Show success message
    EasyEdu.showToast('Chat created successfully!', 'success');
    
    // Re-render chat list
    renderChatList();
    
    // Auto-select the new chat
    selectChat(newChat.id);
}

function startMessagePolling() {
    // Simulate real-time messages (in a real app, you'd use WebSockets)
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
            simulateIncomingMessage();
        }
    }, 5000);
}

function simulateIncomingMessage() {
    if (!currentChat || messages.length === 0) return;
    
    const randomMessages = [
        'That makes sense!',
        'Thanks for sharing that.',
        'I agree with your point.',
        'Good question!',
        'Let me think about that.',
        'Great explanation!'
    ];
    
    const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    
    const newMessage = {
        id: EasyEdu.generateId(),
        senderId: 'other',
        senderName: 'Someone',
        message: randomMessage,
        timestamp: new Date(),
        isOwn: false
    };
    
    // Only add if we're in the current chat
    if (currentChat) {
        messages.push(newMessage);
        currentChat.lastMessage = randomMessage;
        currentChat.lastMessageTime = new Date();
        
        renderMessages();
        renderChatList();
    }
}