function toggleChat() {
    let box = document.getElementById("chatbox");
    box.style.display = box.style.display === "none" ? "block" : "none";
}

function sendMessage() {
    let input = document.getElementById("chat-input");
    let chatBody = document.getElementById("chat-body");

    let userMsg = input.value.trim();
    if (userMsg === "") return;

    // Show user message
    chatBody.innerHTML += `<p><b>You:</b> ${userMsg}</p>`;
    input.value = "";

    // Optional: show typing
    chatBody.innerHTML += `<p id="typing"><b>Bot:</b> typing...</p>`;

    // 🔥 Call backend API
    fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMsg })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("typing").remove();

        chatBody.innerHTML += `<p><b>Bot:</b> ${data.reply}</p>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    })
    .catch(err => {
        document.getElementById("typing").remove();

        // ✅ fallback logic if API fails
        let fallback = getFallbackReply(userMsg);
        chatBody.innerHTML += `<p><b>Bot:</b> ${fallback}</p>`;
    });
}

function getFallbackReply(userMsg) {
    userMsg = userMsg.toLowerCase();

    if (userMsg.includes("login")) {
        return "Enter your username/email and password, then click Login.";
    } 
    else if (userMsg.includes("register")) {
        return "Click on Register Now and fill your details.";
    } 
    else if (userMsg.includes("password")) {
        return "Click on 'Forgot Password' to reset your password.";
    } 
    else if (userMsg.includes("username")) {
        return "Click on 'Forgot Username' and enter your email.";
    }

    return "Sorry, I didn't understand. Try asking about login, register, or password.";
}