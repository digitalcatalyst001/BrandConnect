const registerForm = document.getElementById("registerForm")

if(registerForm){

registerForm.addEventListener("submit", async function(e){

e.preventDefault()

const businessName = document.getElementById("businessName").value
const email = document.getElementById("email").value
const phone = document.getElementById("phone").value
const password = document.getElementById("password").value

const plan = document.querySelector('input[name="plan"]:checked').value

const vendor = {

businessName,
email,
phone,
password,
plan,
subscriptionStart: new Date(),
subscriptionExpiry: new Date(Date.now() + 30*24*60*60*1000)

}

localStorage.setItem("vendor", JSON.stringify(vendor))

alert("Account created successfully")

window.location.href = "dashboard.html"

})

}