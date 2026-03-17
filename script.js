document.addEventListener("DOMContentLoaded", async () => {

const container = document.getElementById("featuredBusinesses")

const businesses = await getFeaturedBusinesses()

businesses.forEach(business => {

container.innerHTML += `

<div class="business-card" data-aos="fade-up">

<img src="${business.photos[0] || 'https://via.placeholder.com/300'}">

<div class="business-content">

<h3>${business.businessName}</h3>

<p>${business.category}</p>

<a class="whatsapp-btn" href="https://wa.me/${business.whatsapp}">
WhatsApp
</a>

</div>

</div>

`

})

})