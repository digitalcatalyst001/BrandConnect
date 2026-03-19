<<<<<<< HEAD
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
=======
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("featuredContainer");

    try {
        const data = await getFeaturedBusinesses();
        data.featured.forEach(biz => {
            container.innerHTML += `
                <div class="card">
                    <h3>${biz.businessName}</h3>
                    <p>${biz.category}</p>
                    <p>${biz.location}</p>
                </div>
            `;
        });
    } catch (error) {
        console.log("Error loading featured businesses");
    }
});

document.getElementById("searchBtn").addEventListener("click", () => {
    const keyword = document.getElementById("keyword").value;
    const location = document.getElementById("location").value;

    window.location.href = 
        `search.html?keyword=${keyword}&location=${location}`;
});
>>>>>>> fc4bc7893c4ac71d7725dd816510094da0e80573
