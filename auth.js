const BASE_URL = "http://localhost:5000/api";

if (document.getElementById("loginBtn")) {
    document.getElementById("loginBtn").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    });
}

if (document.getElementById("registerBtn")) {
    document.getElementById("registerBtn").addEventListener("click", async () => {
        const name = document.getElementById("name").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const role = document.getElementById("role").value;

        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            alert("Registration successful!");
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    });
}