const BASE_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

// Protect Dashboard
if (!token) {
    window.location.href = "login.html";
}

// Switch Sections
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// CREATE / UPDATE PROFILE
document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    const formData = new FormData();

    formData.append("businessName", document.getElementById("businessName").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("whatsapp", document.getElementById("whatsapp").value);
    formData.append("instagram", document.getElementById("instagram").value);

    const photoFiles = document.getElementById("photos").files;
    for (let i = 0; i < photoFiles.length; i++) {
        formData.append("photos", photoFiles[i]);
    }

    const res = await fetch(`${BASE_URL}/vendor/create-profile`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    const data = await res.json();

    if (res.ok) {
        alert("Profile saved successfully!");
    } else {
        alert(data.message);
    }
});

// LOAD SUBSCRIPTION STATUS
async function loadSubscription() {
    const res = await fetch(`${BASE_URL}/subscription/status`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (res.ok) {
        document.getElementById("subscriptionInfo").innerHTML = `
            <p>Plan: ${data.plan}</p>
            <p>Expiry: ${data.expiryDate}</p>
            <p>Status: ${data.status}</p>
        `;
    }
}

// LOAD PLANS
async function loadPlans() {
    const res = await fetch(`${BASE_URL}/subscription/plans`);
    const data = await res.json();

    const container = document.getElementById("plansContainer");

    data.plans.forEach(plan => {
        container.innerHTML += `
            <div class="card">
                <h3>${plan.name.toUpperCase()}</h3>
                <p>₦${plan.price}/month</p>
                <button onclick="payForPlan('${plan.name}')">Subscribe</button>
            </div>
        `;
    });
}

// PAY
async function payForPlan(planName) {
    const businessId = prompt("Enter your Business ID");

    const res = await fetch(`${BASE_URL}/subscription/pay`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            plan: planName,
            businessId
        })
    });

    const data = await res.json();

    if (res.ok) {
        window.location.href = data.paymentLink;
    } else {
        alert(data.message);
    }
}

// INIT
loadSubscription();
loadPlans();