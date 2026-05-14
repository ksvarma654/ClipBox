async function loginvalidation(username, password) {
    const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });
    // Return both the status and the parsed JSON data
    return { ok: response.ok, data: await response.json() };
}

document.getElementById("username-log").addEventListener("input", async function () {
    const username = this.value.trim();
    const password = document.getElementById("password-log").value.trim();
    const msg = document.getElementById("message");

    if (username && password) {
        msg.textContent = "";
        return;
    }
});

document.getElementById("password-log").addEventListener("input", async function () {
    const username = document.getElementById("username-log").value.trim();
    const password = this.value.trim();
    const msg = document.getElementById("message");

    if (username && password) {
        msg.textContent = "";
        return;
    }
});


//-------------fetching details from frontend along with validation-----------------

document.getElementById("login-button").addEventListener("click", async function () {
    const username = document.getElementById("username-log").value.trim();
    const password = document.getElementById("password-log").value.trim();
    const message = document.getElementById("message");

    if (!username && !password) {
        message.style.color = "red";
        message.textContent = "Please enter username and password";
        return;
    }

    if (!username || !password) {
        if (!username) {
            message.style.color = "red";
            message.textContent = "Please enter username or email id";
        } else {
            message.style.color = "red";
            message.textContent = "Please enter password";
        }
        return;
    }


    try {
        const result = await loginvalidation(username, password);

        if (result.ok) {
            // Handle successful login
            // message.style.color = "green";
            // message.textContent = result.data.message;
            // window.location.href = "home_page.html"; // Optional: redirect on success
            alert(result.data.message);
            window.location.href = "home_page.html";
        } else {
            // Handle backend errors (e.g., wrong password, user not found)
            // message.style.color = "red";
            // message.textContent = result.data.detail || "Login failed";
            alert(result.data.detail);
        }
    } catch (error) {
        // This block runs if the fetch() call itself fails (e.g., server is down)
        console.error("Login Error:", error);
        alert("Server connection failed - " + error.message);
    }

});



