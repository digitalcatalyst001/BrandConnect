<<<<<<< HEAD
const container = document.getElementById("businessContainer")

let businesses = JSON.parse(localStorage.getItem("businesses")) || []

businesses.forEach(business => {

const card = document.createElement("div")

card.classList.add("business-card")

card.innerHTML = `

<img src="${business.image}" alt="business image">

<div class="business-content">

<h3>${business.name}</h3>

<span class="badge">${business.category}</span>

<p>${business.location}</p>

<p>${business.description}</p>

<a class="whatsapp-btn" href="https://wa.me/${business.whatsapp}" target="_blank">
WhatsApp
</a>

</div>

`

container.appendChild(card)

})
=======
const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const location = params.get("location");

if (document.getElementById("resultsContainer")) {
    fetch(`http://localhost:5000/api/search?category=${category}&location=${location}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("resultsContainer");
            data.results.forEach(biz => {
                container.innerHTML += `
                    <div class="card">
                        <h3>${biz.businessName}</h3>
                        <p>${biz.category}</p>
                        <p>${biz.location}</p>
                        <a href="profile.html?id=${biz.id}">View Details</a>
                    </div>
                `;
            });
        });
}
>>>>>>> fc4bc7893c4ac71d7725dd816510094da0e80573
