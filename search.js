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