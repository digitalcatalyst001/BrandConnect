const profileForm = document.getElementById("profileForm")

if(profileForm){

profileForm.addEventListener("submit", function(e){

e.preventDefault()

const business = {

name: document.getElementById("businessName").value,

category: document.getElementById("category").value,

location: document.getElementById("location").value,

description: document.getElementById("description").value,

services: document.getElementById("services").value,

whatsapp: document.getElementById("whatsapp").value,

image: document.getElementById("image").value

}

let businesses = JSON.parse(localStorage.getItem("businesses")) || []

businesses.push(business)

localStorage.setItem("businesses", JSON.stringify(businesses))

alert("Business profile created successfully!")

window.location.href = "dashboard.html"

})

}