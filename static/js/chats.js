document.addEventListener("DOMContentLoaded", () => {
    const chatList = document.getElementById("chatList");
    const chatMessages = document.getElementById("chatMessages");
    const messageForm = document.getElementById("messageForm");
    const messageText = document.getElementById("messageText");
    let currentRoomId = null;

    // Load messages when selecting a chat
    function loadMessages(roomId) {
        fetch(`/chat/${roomId}/messages/`)
            .then(res => res.json())
            .then(data => {
                chatMessages.innerHTML = "";
                data.forEach(msg => {
                    const div = document.createElement("div");
                    div.className = "p-2";
                    div.innerHTML = `<strong>${msg.sender}</strong>: ${msg.content} <small class="text-muted">${msg.timestamp}</small>`;
                    chatMessages.appendChild(div);
                });
                document.getElementById("chatInput").style.display = "block";
            });
        currentRoomId = roomId;
    }

    // Send message
    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!currentRoomId) return;
        fetch(`/chat/${currentRoomId}/send/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ content: messageText.value })
        })
        .then(res => res.json())
        .then(msg => {
            const div = document.createElement("div");
            div.className = "p-2";
            div.innerHTML = `<strong>${msg.sender}</strong>: ${msg.content} <small class="text-muted">${msg.timestamp}</small>`;
            chatMessages.appendChild(div);
            messageText.value = "";
        });
    });

    // Helper: CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Example: bind room selection (you can improve later)
    document.querySelectorAll(".chat-item").forEach(item => {
        item.addEventListener("click", () => {
            loadMessages(item.dataset.roomId);
        });
    });
});
